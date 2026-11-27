import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panier",
};

export default function PanierPage() {
  return (
    <section className="container-page py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Panier</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Votre panier est vide pour le moment. Le parcours de commande sera activé avec le catalogue.
      </p>
    </section>
  );
}
