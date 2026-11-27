import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getProductsByCategory } from "@/lib/catalogue";
import { categories } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ categorie: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string }>;
}): Promise<Metadata> {
  const { categorie } = await params;
  const category = categories.find((item) => item.slug === categorie);
  return { title: category ? category.label : "Catalogue" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const category = categories.find((item) => item.slug === categorie);

  if (!category) notFound();

  const list = getProductsByCategory(category.slug);

  return (
    <section className="container-page py-10">
      <nav aria-label="Fil d’Ariane" className="text-xs text-muted">
        <Link href="/catalogue" className="hover:text-foreground">
          Catalogue
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{category.label}</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{category.label}</h1>
          <p className="mt-1 text-sm text-muted">{category.description}</p>
        </div>
        <span className="badge bg-warning/10 text-warning">Données de démonstration</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/catalogue"
          className="badge border border-line bg-surface-solid hover:border-accent hover:text-accent"
        >
          Tout
        </Link>
        {categories.map((item) => (
          <Link
            key={item.slug}
            href={`/catalogue/${item.slug}`}
            className={
              item.slug === category.slug
                ? "badge border border-accent bg-accent-soft text-accent"
                : "badge border border-line bg-surface-solid hover:border-accent hover:text-accent"
            }
          >
            {item.label}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Aucun produit dans cette catégorie pour le moment.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
