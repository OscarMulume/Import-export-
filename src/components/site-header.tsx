import Link from "next/link";
import { CartCount } from "@/components/cart-count";
import { navigation, site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="glass-strong border-x-0 border-t-0">
        <div className="container-page flex h-16 items-center justify-between gap-2">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 rounded-xl sm:gap-2.5"
            aria-label={`${site.name} — accueil`}
          >
            <span
              aria-hidden="true"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm"
            >
              IE
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-semibold tracking-tight sm:text-base">
                {site.name}
              </span>
              <span className="truncate text-[10px] text-muted sm:text-[11px]">
                Import Chine · RDC
              </span>
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

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link href="/panier" className="btn btn-primary btn-compact">
              Panier
              <CartCount />
            </Link>

            <details className="relative md:hidden">
              <summary
                className="btn btn-ghost btn-compact list-none [&::-webkit-details-marker]:hidden"
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
