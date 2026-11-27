import Link from "next/link";
import { CartCount } from "@/components/cart-count";
import { navigation, site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="glass-strong border-x-0 border-t-0">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl"
            aria-label={`${site.name} — accueil`}
          >
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-sm font-bold text-white"
            >
              IE
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-tight">{site.name}</span>
              <span className="text-[11px] text-muted">Import Chine · RDC</span>
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-alt hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/panier" className="btn btn-primary text-sm">
              Panier
              <CartCount />
            </Link>

            <details className="relative md:hidden">
              <summary
                className="btn btn-ghost list-none text-sm [&::-webkit-details-marker]:hidden"
                aria-label="Ouvrir le menu"
              >
                Menu
              </summary>
              <div className="glass-strong absolute right-0 mt-2 w-56 rounded-2xl p-2 shadow-lg">
                <nav aria-label="Navigation mobile" className="flex flex-col">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-surface-alt"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
