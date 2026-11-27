import type { Order } from "@/lib/order";
import type { PaymentMethodId } from "@/lib/payment";

export type PaymentProviderId = "flutterwave" | "manual";

export type PaymentProviderResult =
  | { kind: "manual" }
  | { kind: "checkout" }
  | { kind: "unconfigured"; message: string };

export type PaymentProvider = {
  id: PaymentProviderId;
  label: string;
  supports: (method: PaymentMethodId) => boolean;
  initiate: (order: Order) => PaymentProviderResult;
};

export function isFlutterwaveConfigured(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY?.trim();
  const verifyUrl = process.env.NEXT_PUBLIC_PAYMENT_VERIFY_URL?.trim();
  return Boolean(publicKey && verifyUrl);
}

const manualProvider: PaymentProvider = {
  id: "manual",
  label: "Mobile money manuel",
  supports: (method) => method !== "card",
  initiate: () => ({ kind: "manual" }),
};

const flutterwaveProvider: PaymentProvider = {
  id: "flutterwave",
  label: "Flutterwave",
  supports: (method) => method === "card",
  initiate: () =>
    isFlutterwaveConfigured()
      ? { kind: "checkout" }
      : {
          kind: "unconfigured",
          message:
            "Le paiement par carte via Flutterwave n’est pas encore configuré. Votre commande est enregistrée en attente ; aucun débit n’a été effectué.",
        },
};

export function resolvePaymentProvider(method: PaymentMethodId): PaymentProvider {
  return method === "card" ? flutterwaveProvider : manualProvider;
}
