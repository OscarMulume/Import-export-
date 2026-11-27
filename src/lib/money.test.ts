import { describe, expect, it } from "vitest";
import {
  addPrices,
  formatCdf,
  formatDualPrice,
  formatMoney,
  formatUsd,
  isValidQuantity,
  multiplyPrice,
  roundCdf,
  roundUsd,
} from "./money";

describe("roundUsd", () => {
  it("arrondit au centime", () => {
    expect(roundUsd(1.005)).toBe(1.01);
    expect(roundUsd(2.994)).toBe(2.99);
  });
});

describe("roundCdf", () => {
  it("arrondit au franc entier", () => {
    expect(roundCdf(1234.6)).toBe(1235);
    expect(roundCdf(1234.4)).toBe(1234);
  });
});

describe("formatage", () => {
  it("affiche le dollar et le franc congolais", () => {
    expect(formatUsd(12.5)).toContain("$");
    expect(formatCdf(2500)).toContain("FC");
  });

  it("choisit la devise demandée", () => {
    expect(formatMoney(10, "USD")).toContain("$");
    expect(formatMoney(10, "CDF")).toContain("FC");
  });

  it("affiche le prix double", () => {
    const text = formatDualPrice({ usd: 9.99, cdf: 28000 });
    expect(text).toContain("$");
    expect(text).toContain("FC");
  });
});

describe("calculs de panier", () => {
  it("multiplie un prix par une quantité", () => {
    expect(multiplyPrice({ usd: 10.25, cdf: 29000 }, 3)).toEqual({
      usd: 30.75,
      cdf: 87000,
    });
  });

  it("ignore une quantité négative", () => {
    expect(multiplyPrice({ usd: 10, cdf: 28000 }, -2)).toEqual({ usd: 0, cdf: 0 });
  });

  it("additionne plusieurs lignes", () => {
    expect(
      addPrices([
        { usd: 10.1, cdf: 28000 },
        { usd: 5.2, cdf: 14000 },
      ]),
    ).toEqual({ usd: 15.3, cdf: 42000 });
  });

  it("valide les quantités entières", () => {
    expect(isValidQuantity(1)).toBe(true);
    expect(isValidQuantity(99)).toBe(true);
    expect(isValidQuantity(0)).toBe(false);
    expect(isValidQuantity(1.5)).toBe(false);
    expect(isValidQuantity(100)).toBe(false);
  });
});
