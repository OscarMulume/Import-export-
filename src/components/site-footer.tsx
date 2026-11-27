import Link from "next/link";
import { navigation, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-base font-semibold">{site.name}</p>
          <p className="max-w-sm text-sm text-muted">{site.tagline}.</p>
          <p className="text-xs text-muted">
            Prix affichés en dollars américains (USD) et en francs congolais (CDF / FC).
          </p>
        </div>

        <nav aria-label="Liens du pied de page" className="space-y-2 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Boutique</p>
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="block text-muted hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-2 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Contact</p>
          {site.contactEmail ? (
            <a className="block text-muted hover:text-foreground" href={`mailto:${site.contactEmail}`}>
              {site.contactEmail}
            </a>
          ) : (
            <p className="text-muted">Adresse de contact à confirmer.</p>
          )}
          <p className="text-xs text-muted">Kinshasa, République démocratique du Congo.</p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 M-SEC Technology Consulting — Mulume Izuba Oscar. Tous droits réservés.</p>
          <p>Paiements mobile money en RDC : M-Pesa, Airtel Money, Orange Money, Afrimoney.</p>
        </div>
      </div>
    </footer>
  );
}
