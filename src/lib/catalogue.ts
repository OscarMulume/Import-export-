import type { Money } from "./money";
import type { CategorySlug } from "./site";

/**
 * Catalogue de DÉMONSTRATION.
 *
 * TODO(Oscar) : remplacer chaque produit et chaque prix par les données réelles
 * (nom, description, prix USD et CDF, photo) avant l'ouverture. Aucun prix ici
 * ne doit être présenté comme définitif : l'interface affiche « Prix démo ».
 */
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  price: Money;
  demo: true;
  tone: { from: string; to: string };
};

export const products: Product[] = [
  {
    id: "vet-001",
    slug: "t-shirt-coton-unisexe",
    name: "T-shirt coton unisexe",
    category: "vetements",
    description: "T-shirt en coton, coupe unisexe, disponible en plusieurs tailles.",
    price: { usd: 8.5, cdf: 24000 },
    demo: true,
    tone: { from: "#7c3aed", to: "#db2777" },
  },
  {
    id: "vet-002",
    slug: "robe-ete-legere",
    name: "Robe d'été légère",
    category: "vetements",
    description: "Robe légère pour la saison chaude, tissu souple.",
    price: { usd: 14, cdf: 39000 },
    demo: true,
    tone: { from: "#f97316", to: "#e11d48" },
  },
  {
    id: "vet-003",
    slug: "veste-legere-impermeable",
    name: "Veste légère imperméable",
    category: "vetements",
    description: "Veste de mi-saison avec capuche, matière déperlante.",
    price: { usd: 22, cdf: 62000 },
    demo: true,
    tone: { from: "#0f766e", to: "#0ea5e9" },
  },
  {
    id: "acc-001",
    slug: "sac-a-dos-urbain",
    name: "Sac à dos urbain",
    category: "accessoires",
    description: "Sac à dos avec compartiment ordinateur et poche avant.",
    price: { usd: 16, cdf: 45000 },
    demo: true,
    tone: { from: "#334155", to: "#0ea5e9" },
  },
  {
    id: "acc-002",
    slug: "montre-bracelet-acier",
    name: "Montre bracelet acier",
    category: "accessoires",
    description: "Montre analogique avec bracelet en acier.",
    price: { usd: 12.5, cdf: 35000 },
    demo: true,
    tone: { from: "#57534e", to: "#a8a29e" },
  },
  {
    id: "acc-003",
    slug: "lunettes-de-soleil",
    name: "Lunettes de soleil",
    category: "accessoires",
    description: "Lunettes de soleil avec verres teintés et étui.",
    price: { usd: 6, cdf: 17000 },
    demo: true,
    tone: { from: "#b45309", to: "#f59e0b" },
  },
  {
    id: "ele-001",
    slug: "ecouteurs-sans-fil",
    name: "Écouteurs sans fil",
    category: "electronique",
    description: "Écouteurs Bluetooth avec boîtier de charge.",
    price: { usd: 18, cdf: 50000 },
    demo: true,
    tone: { from: "#1d4ed8", to: "#06b6d4" },
  },
  {
    id: "ele-002",
    slug: "batterie-externe-10000",
    name: "Batterie externe 10 000 mAh",
    category: "electronique",
    description: "Batterie externe avec ports USB-A et USB-C.",
    price: { usd: 15, cdf: 42000 },
    demo: true,
    tone: { from: "#0f172a", to: "#2563eb" },
  },
  {
    id: "ele-003",
    slug: "chargeur-usb-c-rapide",
    name: "Chargeur USB-C rapide",
    category: "electronique",
    description: "Chargeur secteur USB-C avec câble inclus.",
    price: { usd: 9, cdf: 25000 },
    demo: true,
    tone: { from: "#065f46", to: "#22c55e" },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return products.filter((product) => product.category === category);
}
