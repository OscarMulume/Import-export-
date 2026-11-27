import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Panier",
};

export default function PanierPage() {
  return (
    <section className="container-page py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Panier</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Vérifiez vos articles et leurs prix en USD et en CDF avant de passer commande.
      </p>
      <CartView />
    </section>
  );
}
