"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/lib/order";
import { verifyFlutterwavePayment } from "@/lib/payments/verify-client";

type FlutterwaveResponse = {
  transaction_id?: number | string;
  tx_ref?: string;
  status?: string;
};

type FlutterwaveConfig = {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options?: string;
  customer: { email: string; phonenumber?: string; name?: string };
  customizations?: { title?: string; description?: string };
  callback: (response: FlutterwaveResponse) => void;
  onclose: () => void;
};

declare global {
  interface Window {
    FlutterwaveCheckout?: (config: FlutterwaveConfig) => void;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadFlutterwaveScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Navigateur indisponible."));
  }
  if (window.FlutterwaveCheckout) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.flutterwave.com/v3.js"]',
    );

    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("script")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("script"));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    scriptPromise = null;
    throw error;
  });

  return scriptPromise;
}

export function FlutterwaveCardButton({
  order,
  onResult,
}: {
  order: Order;
  onResult: (status: OrderStatus, message: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      await loadFlutterwaveScript();

      const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY?.trim();
      if (!publicKey) throw new Error("missing_public_key");

      const email = order.customer.email?.trim();
      if (!email) {
        onResult(
          "awaiting_confirmation",
          "Un e-mail est requis pour le paiement par carte. Ajoutez-le dans vos coordonnées.",
        );
        setBusy(false);
        return;
      }

      const checkout = window.FlutterwaveCheckout;
      if (!checkout) throw new Error("missing_checkout");

      checkout({
        public_key: publicKey,
        tx_ref: order.reference,
        amount: order.totals.usd,
        currency: "USD",
        payment_options: "card",
        customer: {
          email,
          phonenumber: order.customer.phone,
          name: order.customer.name,
        },
        customizations: {
          title: "Import-Export",
          description: `Commande ${order.reference}`,
        },
        callback: (response) => {
          const transactionId = response?.transaction_id
            ? String(response.transaction_id)
            : "";

          if (!transactionId) {
            onResult(
              "awaiting_confirmation",
              "Paiement non confirmé : identifiant de transaction manquant.",
            );
            setBusy(false);
            return;
          }

          void verifyFlutterwavePayment({
            transactionId,
            reference: order.reference,
            amount: order.totals.usd,
            currency: "USD",
          }).then((result) => {
            if (result.verified) {
              onResult("paid", "Paiement confirmé par le serveur.");
            } else {
              onResult(
                "awaiting_confirmation",
                "Paiement non confirmé. La commande reste en attente.",
              );
            }
            setBusy(false);
          });
        },
        onclose: () => {
          setBusy(false);
        },
      });
    } catch {
      setError(
        "Impossible d’ouvrir le paiement Flutterwave. Réessayez ou choisissez le mobile money.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted">
        Le paiement carte est débité en USD ; le montant en FC reste affiché à titre indicatif.
      </p>
      <button type="button" className="btn btn-primary" onClick={handleClick} disabled={busy}>
        {busy ? "Ouverture du paiement…" : "Payer par carte avec Flutterwave"}
      </button>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
