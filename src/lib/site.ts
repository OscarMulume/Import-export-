export const site = {
  name: "Import-Export",
  nameIsProvisional: true,
  tagline: "Vêtements, accessoires et électronique importés de Chine",
  description:
    "Boutique en ligne de vêtements, accessoires et électronique importés de Chine, livrés en République démocratique du Congo. Prix en dollars et en francs congolais.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
} as const;

export const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/suivi", label: "Suivi de commande" },
  { href: "/aide", label: "Aide" },
] as const;

export const categories = [
  {
    slug: "vetements",
    label: "Vêtements",
    description: "Prêt-à-porter, tenues et textiles.",
  },
  {
    slug: "accessoires",
    label: "Accessoires",
    description: "Sacs, montres, lunettes et petits équipements.",
  },
  {
    slug: "electronique",
    label: "Électronique",
    description: "Audio, charge, accessoires téléphone et maison.",
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];
