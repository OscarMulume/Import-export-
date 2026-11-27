import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderLookup } from "@/components/order-lookup";

export const metadata: Metadata = {
  title: "Suivi de commande",
  description: "Retrouvez une commande avec sa référence.",
};

export default function SuiviPage() {
  return (
    <section className="container-page py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Suivi de commande</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Saisissez la référence reçue lors de la commande. En mode démonstration, le suivi fonctionne
        dans le navigateur qui a créé la commande.
      </p>
      <Suspense fallback={<p className="mt-6 text-sm text-muted">Chargement…</p>}>
        <OrderLookup />
      </Suspense>
    </section>
  );
}
