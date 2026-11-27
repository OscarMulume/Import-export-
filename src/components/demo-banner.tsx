import { site } from "@/lib/site";

export function DemoBanner() {
  if (!site.demoMode) return null;

  return (
    <div className="border-b border-line bg-warning/10">
      <div className="container-page flex flex-wrap items-center gap-2 py-2 text-xs">
        <span className="badge bg-warning/15 text-warning">Démonstration</span>
        <p className="text-muted">
          Version de démonstration : les prix, les visuels et les moyens de paiement seront confirmés
          avant l’ouverture.
        </p>
      </div>
    </div>
  );
}
