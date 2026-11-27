import fs from "node:fs";
import path from "node:path";
import { paymentLogoIds, type PaymentLogoId } from "./payment";

/**
 * Détecte, au moment du build, les logos officiels réellement présents dans
 * public/logos. Aucun logo n'est fabriqué : sans fichier officiel, l'interface
 * affiche un badge texte neutre.
 */
export function getAvailablePaymentLogos(): PaymentLogoId[] {
  try {
    const directory = path.join(process.cwd(), "public", "logos");
    const files = new Set(fs.readdirSync(directory));
    return paymentLogoIds.filter((id) => files.has(`${id}.svg`));
  } catch {
    return [];
  }
}
