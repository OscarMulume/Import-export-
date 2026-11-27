import { describe, expect, it } from "vitest";
import {
  addLine,
  cartCount,
  cartTotals,
  CART_MAX_QTY,
  parseCart,
  removeLine,
  resolveCart,
  setLineQuantity,
} from "./cart";

describe("addLine", () => {
  it("ajoute une nouvelle ligne", () => {
    expect(addLine([], "vet-001")).toEqual([{ productId: "vet-001", quantity: 1 }]);
  });

  it("cumule la quantité d'une ligne existante", () => {
    const lines = addLine([{ productId: "vet-001", quantity: 2 }], "vet-001", 3);
    expect(lines).toEqual([{ productId: "vet-001", quantity: 5 }]);
  });

  it("plafonne la quantité maximale", () => {
    const lines = addLine([{ productId: "vet-001", quantity: CART_MAX_QTY }], "vet-001", 5);
    expect(lines[0].quantity).toBe(CART_MAX_QTY);
  });
});

describe("setLineQuantity", () => {
  it("change la quantité", () => {
    expect(setLineQuantity([{ productId: "vet-001", quantity: 1 }], "vet-001", 4)).toEqual([
      { productId: "vet-001", quantity: 4 },
    ]);
  });

  it("supprime la ligne quand la quantité tombe à zéro", () => {
    expect(setLineQuantity([{ productId: "vet-001", quantity: 1 }], "vet-001", 0)).toEqual([]);
  });
});

describe("removeLine et cartCount", () => {
  it("retire une ligne et compte le reste", () => {
    const lines = [
      { productId: "vet-001", quantity: 2 },
      { productId: "acc-001", quantity: 1 },
    ];
    expect(removeLine(lines, "vet-001")).toEqual([{ productId: "acc-001", quantity: 1 }]);
    expect(cartCount(lines)).toBe(3);
  });
});

describe("resolveCart et cartTotals", () => {
  it("résout les produits connus et ignore les inconnus", () => {
    const resolved = resolveCart([
      { productId: "vet-001", quantity: 2 },
      { productId: "inconnu", quantity: 1 },
    ]);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].product.id).toBe("vet-001");
    expect(resolved[0].lineTotal).toEqual({ usd: 17, cdf: 48000 });
  });

  it("additionne les totaux en USD et en CDF", () => {
    expect(
      cartTotals([
        { productId: "vet-001", quantity: 1 },
        { productId: "ele-003", quantity: 2 },
      ]),
    ).toEqual({ usd: 26.5, cdf: 74000 });
  });
});

describe("parseCart", () => {
  it("ignore les valeurs invalides et les doublons", () => {
    expect(
      parseCart([
        { productId: "vet-001", quantity: 2 },
        { productId: "vet-001", quantity: 5 },
        { productId: "inconnu", quantity: 1 },
        { productId: "acc-001", quantity: "3" },
        null,
      ]),
    ).toEqual([{ productId: "vet-001", quantity: 2 }]);
  });

  it("renvoie un panier vide pour une valeur non tableau", () => {
    expect(parseCart({})).toEqual([]);
    expect(parseCart(null)).toEqual([]);
  });
});
