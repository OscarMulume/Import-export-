import { describe, expect, it } from "vitest";
import { answerBot, botWelcome } from "./bot";

describe("botWelcome", () => {
  it("propose des suggestions et précise l'absence d'IA externe", () => {
    expect(botWelcome.suggestions?.length).toBeGreaterThan(0);
    expect(botWelcome.text).toContain("sans IA externe");
  });
});

describe("answerBot", () => {
  it("reconnaît les moyens de paiement RDC et exclut MTN Moov", () => {
    const reply = answerBot("Comment payer ?");
    expect(reply.text).toContain("M-Pesa");
    expect(reply.text).toContain("Airtel Money");
    expect(reply.text).toContain("Orange Money");
    expect(reply.text).toContain("Afrimoney");
    expect(reply.text).not.toMatch(/MTN|Moov/i);
    expect(reply.text).toContain("confirmation réelle");
  });

  it("renvoie vers le suivi de commande", () => {
    const reply = answerBot("suivi de commande");
    expect(reply.links?.some((link) => link.href === "/suivi")).toBe(true);
  });

  it("trouve un produit par mot-clé", () => {
    const reply = answerBot("je cherche un t-shirt");
    expect(reply.links?.some((link) => link.href === "/produit/t-shirt-coton-unisexe")).toBe(true);
    expect(reply.text).toContain("démonstration");
  });

  it("ne promet pas de délai de livraison", () => {
    const reply = answerBot("livraison");
    expect(reply.text).toMatch(/confirm/i);
    expect(reply.text).not.toMatch(/\d+\s*(jours|heures|h)\b/i);
  });

  it("ne donne pas de prix réel", () => {
    const reply = answerBot("combien coûte un sac ?");
    expect(reply.text).toContain("démonstration");
  });

  it("ne donne pas de contact inventé", () => {
    const reply = answerBot("parler à un humain");
    expect(reply.text).toContain("confirmée avant l’ouverture");
  });

  it("propose une réponse générique et sûre pour l'inconnu", () => {
    const reply = answerBot("blabla xyz");
    expect(reply.text).toContain("Je n’ai pas de réponse fiable");
    expect(reply.suggestions?.length).toBeGreaterThan(0);
  });
});
