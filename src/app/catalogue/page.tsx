import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalogue";
import { categories } from "@/lib/site";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Vêtements, accessoires et électronique importés de Chine.",
};

export default function CataloguePage() {
  return (
    <section className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Catalogue</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Vêtements, accessoires et électronique. Chaque prix est affiché en dollars américains (USD)
            et en francs congolais (CDF / FC).
          </p>
        </div>
        <span className="badge bg-warning/10 text-warning">Données de démonstration</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="badge border border-accent bg-accent-soft text-accent">Tout</span>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/catalogue/${category.slug}`}
            className="badge border border-line bg-surface-solid hover:border-accent hover:text-accent"
          >
            {category.label}
          </Link>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted">
        Les produits, prix et visuels ci-dessous sont des données de démonstration, à remplacer par les
        données réelles avant l’ouverture.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
