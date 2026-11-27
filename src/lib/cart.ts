import { getProductById, type Product } from "./catalogue";
import { addPrices, multiplyPrice, type Money } from "./money";

export const CART_STORAGE_KEY = "ie.cart.v1";
export const CART_MAX_QTY = 99;

export type CartLine = {
  productId: string;
  quantity: number;
};

export type ResolvedCartLine = {
  product: Product;
  quantity: number;
  lineTotal: Money;
};

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(CART_MAX_QTY, Math.floor(quantity)));
}

export function addLine(lines: CartLine[], productId: string, quantity = 1): CartLine[] {
  const qty = clampQuantity(quantity);
  const existing = lines.find((line) => line.productId === productId);

  if (!existing) {
    return [...lines, { productId, quantity: qty }];
  }

  return lines.map((line) =>
    line.productId === productId
      ? { ...line, quantity: Math.min(CART_MAX_QTY, line.quantity + qty) }
      : line,
  );
}

export function setLineQuantity(
  lines: CartLine[],
  productId: string,
  quantity: number,
): CartLine[] {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return removeLine(lines, productId);
  }

  const qty = clampQuantity(quantity);
  return lines.map((line) =>
    line.productId === productId ? { ...line, quantity: qty } : line,
  );
}

export function removeLine(lines: CartLine[], productId: string): CartLine[] {
  return lines.filter((line) => line.productId !== productId);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export function resolveCart(lines: CartLine[]): ResolvedCartLine[] {
  return lines.flatMap((line) => {
    const product = getProductById(line.productId);
    if (!product) return [];
    return [
      {
        product,
        quantity: line.quantity,
        lineTotal: multiplyPrice(product.price, line.quantity),
      },
    ];
  });
}

export function cartTotals(lines: CartLine[]): Money {
  return addPrices(resolveCart(lines).map((line) => line.lineTotal));
}

export function parseCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const result: CartLine[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const { productId, quantity } = item as Record<string, unknown>;

    if (typeof productId !== "string" || seen.has(productId)) continue;
    if (!getProductById(productId)) continue;
    if (typeof quantity !== "number" || !Number.isFinite(quantity)) continue;

    seen.add(productId);
    result.push({ productId, quantity: clampQuantity(quantity) });
  }

  return result;
}
