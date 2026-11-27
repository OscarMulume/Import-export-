import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductVisual } from "@/components/product-visual";
import { getProductBySlug, products } from "@/lib/catalogue";
import { formatDualPrice } from "@/lib/money";
import { categories } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const category = categories.find((item) => item.slug === product.category);

  return (
    <section className="container-page py-10">
      <nav aria-label="Fil d’Ariane" className="text-xs text-muted">
        <Link href="/catalogue" className="hover:text-foreground">
          Catalogue
        </Link>
        <span aria-hidden="true"> / </span>
        {category ? (
          <>
            <Link href={`/catalogue/${category.slug}`} className="hover:text-foreground">
              {category.label}
            </Link>
            <span aria-hidden="true"> / </span>
          </>
        ) : null}
        <span>{product.name}</span>
      </nav>

      <div className="mt-5 grid gap-8 md:grid-cols-2">
        <div className="card overflow-hidden">
          <ProductVisual product={product} className="aspect-[4/3] w-full" />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge bg-warning/10 text-warning">Prix de démonstration</span>
            {category ? (
              <span className="badge border border-line bg-surface-solid">{category.label}</span>
            ) : null}
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-base leading-relaxed text-muted">{product.description}</p>

          <div className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Prix</p>
            <p className="mt-1 text-2xl font-semibold">{formatDualPrice(product.price)}</p>
            <p className="mt-1 text-xs text-muted">
              Prix de démonstration, à confirmer avant l’ouverture. Aucun paiement n’est effectué ici.
            </p>
          </div>

          <AddToCartButton productId={product.id} className="btn btn-primary w-full md:w-auto" />

          <div className="card space-y-2 p-4 text-sm text-muted">
            <p className="font-semibold text-foreground">Visuel temporaire</p>
            <p>
              La photo réelle de ce produit n’est pas encore disponible. Le visuel affiché est un
              remplacement, pas une photo du produit.
            </p>
          </div>

          <Link href="/catalogue" className="text-sm font-medium text-accent hover:underline">
            Retour au catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}
