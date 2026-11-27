import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout-flow";
import { getAvailablePaymentLogos } from "@/lib/payment-logos";

export const metadata: Metadata = {
  title: "Commande",
  description: "Commande invité, choix du moyen de paiement et confirmation.",
};

export default function CommandePage() {
  const availableLogos = getAvailablePaymentLogos();

  return (
    <section className="container-page py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Commande</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Commande invité par défaut. Le compte est optionnel et n’est jamais demandé avant l’achat.
        Choisissez un moyen de paiement pour enregistrer la commande en un clic.
      </p>
      <CheckoutFlow availableLogos={availableLogos} />
    </section>
  );
}
