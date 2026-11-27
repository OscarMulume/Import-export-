import Link from "next/link";
import { categories, site } from "@/lib/site";

const steps = [
  {
    title: "Choisissez vos produits",
    description:
      "Parcourez le catalogue par catégorie et ajoutez vos articles au panier. Chaque prix est affiché en USD et en FC.",
  },
  {
    title: "Payez en un clic",
    description:
      "Sélectionnez votre moyen de paiement : mobile money (M-Pesa, Airtel Money, Orange Money, Afrimoney) ou carte.",
  },
  {
    title: "Suivez votre commande",
    description:
      "Une référence de commande vous est remise. Le suivi se fait avec cette référence, sans créer de compte.",
  },
];

const paymentMethods = [
  "M-Pesa",
  "Airtel Money",
  "Orange Money",
  "Afrimoney",
  "Flutterwave",
  "Visa / Mastercard",
];

export default function Home() {
  return (
    <>
      <section className="container-page pt-10 pb-6 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
          <div className="animate-fade-up space-y-6">
            <span className="badge bg-accent-soft text-accent">Import direct de Chine</span>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
              Des produits choisis, des prix en dollars et en francs congolais.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">
              {site.tagline}. Commandez en ligne, payez avec le mobile money de votre opérateur ou par
              carte, puis suivez votre commande avec une simple référence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/catalogue" className="btn btn-primary">
                Voir le catalogue
              </Link>
              <Link href="#comment-ca-marche" className="btn btn-ghost">
                Comment ça marche
              </Link>
            </div>
            <p className="text-xs text-muted">
              Paiement en ligne sécurisé. Aucune commande n’est marquée comme payée avant confirmation
              réelle du paiement.
            </p>
          </div>

          <div className="animate-fade-in glass rounded-3xl p-4 shadow-[var(--shadow)] md:p-5">
            <div className="grid gap-3">
              {categories.map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/catalogue?categorie=${category.slug}`}
                  className="card card-hover flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{category.label}</p>
                    <p className="text-xs text-muted">{category.description}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-semibold text-accent"
                  >
                    0{index + 1}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-surface-alt p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Devises</p>
              <p className="mt-1 text-sm">
                USD et CDF (FC) affichés sur chaque produit, sans conversion forcée.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="categories-titre" className="container-page py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="categories-titre" className="text-2xl font-semibold tracking-tight md:text-3xl">
              Trois univers
            </h2>
            <p className="mt-1 text-sm text-muted">Vêtements, accessoires et électronique.</p>
          </div>
          <Link href="/catalogue" className="text-sm font-medium text-accent hover:underline">
            Tout voir
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/catalogue?categorie=${category.slug}`}
              className="card card-hover group overflow-hidden"
            >
              <div
                aria-hidden="true"
                className="h-36 bg-[radial-gradient(120%_120%_at_0%_0%,var(--accent-soft),transparent_60%),linear-gradient(135deg,var(--surface-alt),var(--surface-solid))]"
              />
              <div className="space-y-1 p-5">
                <p className="font-semibold">{category.label}</p>
                <p className="text-sm text-muted">{category.description}</p>
                <p className="pt-2 text-sm font-medium text-accent">Découvrir</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="comment-ca-marche" className="container-page py-10">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Comment ça marche</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="card p-5">
              <span className="badge bg-accent-soft text-accent">Étape {index + 1}</span>
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="glass rounded-3xl p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                Paiement mobile money et carte
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted">
                Les opérateurs disponibles en République démocratique du Congo. Le paiement par carte et
                mobile money passe par Flutterwave lorsque les clés sont configurées ; sinon, un paiement
                mobile money manuel est proposé avec confirmation.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <span key={method} className="badge border border-line bg-surface-solid">
                    {method}
                  </span>
                ))}
              </div>
            </div>
            <Link href="/catalogue" className="btn btn-primary">
              Commencer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
