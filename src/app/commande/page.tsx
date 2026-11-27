import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Commande",
};

export default function CommandePage() {
  return (
    <section className="container-page py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Commande</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Le parcours de commande (checkout invité, choix du moyen de paiement et confirmation) sera activé
        à l’étape suivante.
      </p>
      <Link href="/panier" className="btn btn-ghost mt-4">
        Retour au panier
      </Link>
    </section>
  );
}
