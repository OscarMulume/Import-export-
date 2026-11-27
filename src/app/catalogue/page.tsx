import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Vêtements, accessoires et électronique importés de Chine.",
};

export default function CataloguePage() {
  return (
    <section className="container-page py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Catalogue</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Le catalogue détaillé (vêtements, accessoires, électronique) est en préparation. Les produits et
        les prix seront publiés après validation.
      </p>
    </section>
  );
}
