"use client";

import Link from "next/link";
import { ProductVisual } from "@/components/product-visual";
import { useCart } from "@/lib/cart-context";
import { formatCdf, formatDualPrice, formatUsd } from "@/lib/money";

export function CartView() {
  const { resolved, totals, ready, count, setQuantity, remove, clear } = useCart();

  if (!ready) {
    return <p className="mt-6 text-sm text-muted">Chargement du panier…</p>;
  }

  if (resolved.length === 0) {
    return (
      <div className="card mt-6 max-w-xl p-6">
        <p className="font-semibold">Votre panier est vide.</p>
        <p className="mt-1 text-sm text-muted">
          Parcourez le catalogue et ajoutez des articles pour préparer une commande.
        </p>
        <Link href="/catalogue" className="btn btn-primary mt-4">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <ul className="space-y-3">
        {resolved.map(({ product, quantity, lineTotal }) => (
          <li key={product.id} className="card flex gap-3 p-3">
            <Link
              href={`/produit/${product.slug}`}
              className="w-24 shrink-0 overflow-hidden rounded-xl"
              aria-label={`Voir ${product.name}`}
            >
              <ProductVisual product={product} className="h-24 w-24" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <Link href={`/produit/${product.slug}`} className="font-semibold hover:underline">
                  {product.name}
                </Link>
                <span className="badge bg-warning/10 text-warning">Prix démo</span>
              </div>
              <p className="text-xs text-muted">{formatDualPrice(product.price)} l’unité</p>
              <p className="text-sm font-semibold">{formatDualPrice(lineTotal)}</p>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 rounded-full border border-line p-1">
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded-full text-lg leading-none hover:bg-surface-alt disabled:opacity-40"
                    onClick={() => setQuantity(product.id, quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label={`Diminuer la quantité de ${product.name}`}
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm font-semibold" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded-full text-lg leading-none hover:bg-surface-alt"
                    onClick={() => setQuantity(product.id, quantity + 1)}
                    aria-label={`Augmenter la quantité de ${product.name}`}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-xs font-medium text-danger hover:underline"
                  onClick={() => remove(product.id)}
                >
                  Retirer
                </button>
              </div>
            </div>
          </li>
        ))}

        <li className="flex justify-end">
          <button type="button" className="text-xs text-muted hover:underline" onClick={clear}>
            Vider le panier
          </button>
        </li>
      </ul>

      <aside className="card h-fit space-y-3 p-5">
        <h2 className="text-lg font-semibold">Récapitulatif</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Articles</span>
          <span className="font-medium">{count}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Sous-total USD</span>
          <span className="font-semibold">{formatUsd(totals.usd)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Sous-total CDF</span>
          <span className="font-semibold">{formatCdf(totals.cdf)}</span>
        </div>
        <p className="text-xs text-muted">
          Les deux devises sont affichées. La devise de paiement est choisie à l’étape suivante.
        </p>
        <Link href="/commande" className="btn btn-primary w-full">
          Passer commande
        </Link>
        <p className="text-center text-xs text-muted">
          Aucun paiement n’est effectué sur cette page. Le statut « payé » n’apparaît qu’après
          confirmation réelle.
        </p>
      </aside>
    </div>
  );
}
