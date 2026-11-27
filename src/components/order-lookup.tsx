"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { formatDualPrice } from "@/lib/money";
import { orderStatusLabel, type Order, type OrderStatus } from "@/lib/order";
import { findOrder } from "@/lib/order-storage";
import { getPaymentMethod } from "@/lib/payment";

function statusClass(status: OrderStatus): string {
  switch (status) {
    case "paid":
      return "bg-success/15 text-success";
    case "awaiting_confirmation":
      return "bg-accent-soft text-accent";
    case "cancelled":
      return "bg-danger/10 text-danger";
    default:
      return "bg-warning/10 text-warning";
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-CD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function OrderLookup() {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState(() =>
    (searchParams.get("ref") ?? "").toUpperCase(),
  );
  const [result, setResult] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const found = findOrder(reference);
    setResult(found ?? null);
    setSearched(true);
  }

  return (
    <div className="mt-6 max-w-2xl space-y-4">
      <form onSubmit={handleSubmit} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1">
          <label htmlFor="reference" className="text-sm font-medium">
            Référence de commande
          </label>
          <input
            id="reference"
            value={reference}
            onChange={(event) => setReference(event.target.value.toUpperCase())}
            placeholder="IE-20261127-XXXX"
            className="w-full rounded-xl border border-line bg-surface-solid px-3 py-2.5 font-mono text-sm outline-none focus:border-accent"
            autoComplete="off"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Rechercher
        </button>
      </form>

      {searched && !result ? (
        <div className="card p-5 text-sm">
          <p className="font-semibold">Aucune commande trouvée dans ce navigateur.</p>
          <p className="mt-1 text-muted">
            En mode démonstration, les commandes sont stockées localement sur l’appareil qui les a
            créées. Si vous avez commandé sur un autre appareil, contactez la boutique.
          </p>
        </div>
      ) : null}

      {result ? (
        <div className="card space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Commande</p>
              <p className="font-mono text-lg font-semibold">{result.reference}</p>
            </div>
            <span className={`badge ${statusClass(result.status)}`}>
              {orderStatusLabel(result.status)}
            </span>
          </div>

          <p className="text-xs text-muted">Créée le {formatDate(result.createdAt)}</p>

          <ul className="space-y-2 text-sm">
            {result.items.map((item) => (
              <li key={item.productId} className="flex items-start justify-between gap-2">
                <span className="text-muted">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">{formatDualPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
            <span className="text-muted">Total</span>
            <span className="font-semibold">{formatDualPrice(result.totals)}</span>
          </div>

          <p className="text-xs text-muted">
            Paiement : {getPaymentMethod(result.paymentMethod)?.label ?? result.paymentMethod}.
            Aucun statut « payée » n’est affiché sans confirmation réelle.
          </p>

          <Link href="/catalogue" className="btn btn-ghost">
            Retour au catalogue
          </Link>
        </div>
      ) : null}

      <p className="text-xs text-muted">
        Les commandes de démonstration sont enregistrées dans ce navigateur uniquement.
      </p>
    </div>
  );
}
