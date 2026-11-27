import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductVisual } from "@/components/product-visual";
import type { Product } from "@/lib/catalogue";
import { formatDualPrice } from "@/lib/money";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card card-hover flex flex-col overflow-hidden">
      <ProductVisual product={product} className="h-40" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/produit/${product.slug}`}
            className="font-semibold leading-snug hover:underline"
          >
            {product.name}
          </Link>
          <span className="badge shrink-0 bg-warning/10 text-warning">Prix démo</span>
        </div>
        <p className="text-sm text-muted">{product.description}</p>
        <p className="mt-auto pt-2 text-base font-semibold">{formatDualPrice(product.price)}</p>
        <AddToCartButton productId={product.id} />
      </div>
    </article>
  );
}
