import { products } from "./catalogue";
import { site } from "./site";

export type BotLink = { label: string; href: string };

export type BotReply = {
  text: string;
  links?: BotLink[];
  suggestions?: string[];
};

const defaultSuggestions = [
  "Catalogue",
  "Paiement",
  "Suivi de commande",
  "Livraison",
  "Parler à un humain",
];

export const botWelcome: BotReply = {
  text: "Bonjour ! Je suis l’assistant de la boutique. Je peux vous aider à trouver un produit, comprendre les paiements ou suivre une commande. Réponses automatiques, sans IA externe.",
  suggestions: defaultSuggestions,
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function answerBot(message: string): BotReply {
  const text = normalize(message);

  const matches = products.filter((product) => {
    if (text.includes(normalize(product.slug))) return true;
    return normalize(product.name)
      .split(/\s+/)
      .some((word) => word.length >= 3 && text.includes(word));
  });

  if (matches.length > 0) {
    return {
      text: `J’ai trouvé ${matches.length} produit${matches.length > 1 ? "s" : ""} correspondant. Les prix affichés sont des prix de démonstration.`,
      links: matches.slice(0, 4).map((product) => ({
        label: product.name,
        href: `/produit/${product.slug}`,
      })),
      suggestions: ["Voir tout le catalogue", "Paiement", "Suivi de commande"],
    };
  }

  if (/(paiement|payer|mpesa|airtel|orange|afrimoney|carte|flutterwave|mobile money)/.test(text)) {
    return {
      text: "Vous pouvez payer par mobile money en RDC : M-Pesa, Airtel Money, Orange Money ou Afrimoney, ou par carte via Flutterwave lorsque les clés sont configurées. Aucune commande n’est marquée payée sans confirmation réelle.",
      links: [
        { label: "Passer commande", href: "/commande" },
        { label: "Aide", href: "/aide" },
      ],
      suggestions: ["Catalogue", "Suivi de commande", "Parler à un humain"],
    };
  }

  if (/(suivi|suivre|reference|commande)/.test(text)) {
    return {
      text: "Le suivi se fait avec la référence de commande. En mode démonstration, il fonctionne dans le navigateur qui a créé la commande.",
      links: [{ label: "Suivre une commande", href: "/suivi" }],
      suggestions: ["Catalogue", "Paiement", "Livraison"],
    };
  }

  if (/(livraison|livrer|expedition|delai)/.test(text)) {
    return {
      text: "Les modalités et les délais de livraison en RDC seront confirmés avant l’ouverture de la boutique. Aucun délai n’est annoncé pour l’instant.",
      links: [
        {
          label: site.contactEmail ? "Nous contacter" : "Voir l’aide",
          href: site.contactEmail ? `mailto:${site.contactEmail}` : "/aide",
        },
      ],
      suggestions: ["Catalogue", "Paiement", "Parler à un humain"],
    };
  }

  if (/(prix|tarif|combien|cout|cher)/.test(text)) {
    return {
      text: "Chaque prix est affiché en dollars (USD) et en francs congolais (FC). Le catalogue actuel est une démonstration : les prix réels seront confirmés avant l’ouverture.",
      links: [{ label: "Voir le catalogue", href: "/catalogue" }],
      suggestions: ["Paiement", "Livraison", "Suivi de commande"],
    };
  }

  if (/(retour|remboursement|echange)/.test(text)) {
    return {
      text: "La politique de retour et de remboursement sera publiée avant l’ouverture. Je ne peux pas confirmer de conditions pour l’instant.",
      links: [{ label: "Aide", href: "/aide" }],
      suggestions: ["Paiement", "Livraison", "Parler à un humain"],
    };
  }

  if (/(humain|contact|parler|email|telephone|appeler)/.test(text)) {
    if (site.contactEmail) {
      return {
        text: `Vous pouvez écrire à ${site.contactEmail}.`,
        links: [{ label: "Écrire un e-mail", href: `mailto:${site.contactEmail}` }],
        suggestions: ["Catalogue", "Paiement", "Suivi de commande"],
      };
    }
    return {
      text: "L’adresse de contact de la boutique sera confirmée avant l’ouverture. En attendant, je peux vous aider sur le catalogue, le paiement ou le suivi.",
      links: [{ label: "Voir l’aide", href: "/aide" }],
      suggestions: ["Catalogue", "Paiement", "Suivi de commande"],
    };
  }

  if (/(catalogue|produit|article|vetement|accessoire|electronique)/.test(text)) {
    return {
      text: "Le catalogue contient des vêtements, accessoires et électronique. Les produits affichés sont une démonstration.",
      links: [
        { label: "Voir le catalogue", href: "/catalogue" },
        { label: "Vêtements", href: "/catalogue/vetements" },
        { label: "Accessoires", href: "/catalogue/accessoires" },
        { label: "Électronique", href: "/catalogue/electronique" },
      ],
      suggestions: ["Paiement", "Livraison", "Suivi de commande"],
    };
  }

  return {
    text: "Je n’ai pas de réponse fiable pour cette question. Je peux vous aider sur le catalogue, les paiements, le suivi ou la livraison.",
    links: [{ label: "Aide", href: "/aide" }],
    suggestions: defaultSuggestions,
  };
}
