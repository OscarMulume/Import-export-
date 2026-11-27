import { describe, expect, it } from "vitest";
import {
  buildOrder,
  generateOrderReference,
  isOrderStatus,
  orderStatusLabel,
  validateCustomer,
} from "./order";

const validCustomer = {
  name: "Awa Kabila",
  phone: "+243 810 000 000",
  city: "Kinshasa",
  address: "Avenue du Commerce, numéro 10",
};

describe("validateCustomer", () => {
  it("accepte un client valide sans e-mail", () => {
    expect(validateCustomer(validCustomer)).toEqual({});
  });

  it("signale les champs manquants", () => {
    const errors = validateCustomer({});
    expect(errors.name).toBeTruthy();
    expect(errors.phone).toBeTruthy();
    expect(errors.city).toBeTruthy();
    expect(errors.address).toBeTruthy();
  });

  it("refuse un téléphone trop court", () => {
    expect(validateCustomer({ ...validCustomer, phone: "123" }).phone).toBeTruthy();
  });

  it("refuse un e-mail invalide", () => {
    expect(validateCustomer({ ...validCustomer, email: "pas-un-email" }).email).toBeTruthy();
  });
});

describe("generateOrderReference", () => {
  it("génère une référence datée et stable avec un aléatoire injecté", () => {
    const reference = generateOrderReference(new Date(2026, 10, 27), () => 0);
    expect(reference).toBe("IE-20261127-0000");
  });

  it("utilise un suffixe alphanumérique", () => {
    const reference = generateOrderReference(new Date(2026, 0, 5), () => 0.5);
    expect(reference).toMatch(/^IE-20260105-[0-9A-Z]{4}$/);
  });
});

describe("buildOrder", () => {
  it("construit une commande en attente de paiement avec les bons totaux", () => {
    const order = buildOrder({
      customer: validCustomer,
      lines: [
        { productId: "vet-001", quantity: 2 },
        { productId: "ele-003", quantity: 1 },
      ],
      paymentMethod: "mpesa",
      now: new Date(2026, 10, 27),
      random: () => 0,
    });

    expect(order.status).toBe("pending_payment");
    expect(order.demo).toBe(true);
    expect(order.reference).toBe("IE-20261127-0000");
    expect(order.items).toHaveLength(2);
    expect(order.totals).toEqual({ usd: 26, cdf: 73000 });
    expect(order.paymentMethod).toBe("mpesa");
  });

  it("refuse un panier vide", () => {
    expect(() =>
      buildOrder({
        customer: validCustomer,
        lines: [],
        paymentMethod: "mpesa",
      }),
    ).toThrow();
  });
});

describe("statuts", () => {
  it("libelle les statuts", () => {
    expect(orderStatusLabel("pending_payment")).toBe("En attente de paiement");
    expect(orderStatusLabel("awaiting_confirmation")).toBe("Paiement à confirmer");
    expect(orderStatusLabel("paid")).toBe("Payée");
    expect(orderStatusLabel("cancelled")).toBe("Annulée");
  });

  it("reconnaît les statuts valides", () => {
    expect(isOrderStatus("paid")).toBe(true);
    expect(isOrderStatus("inconnu")).toBe(false);
  });
});
