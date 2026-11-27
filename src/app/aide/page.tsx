import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aide",
};

export default function AidePage() {
  return (
    <section className="container-page py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Aide</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Les questions fréquentes (commande, paiement mobile money, livraison) seront publiées avant
        l’ouverture.
      </p>
    </section>
  );
}
