import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suivi de commande",
};

export default function SuiviPage() {
  return (
    <section className="container-page py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Suivi de commande</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Le suivi par référence de commande sera disponible dès l’ouverture de la boutique.
      </p>
    </section>
  );
}
