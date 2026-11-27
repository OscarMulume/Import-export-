import { isOrderStatus, type Order, type OrderStatus } from "./order";
import { isPaymentMethodId } from "./payment";

export const ORDERS_STORAGE_KEY = "ie.orders.v1";
const MAX_STORED_ORDERS = 50;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMoney(value: unknown): boolean {
  return (
    isRecord(value) && typeof value.usd === "number" && typeof value.cdf === "number"
  );
}

function isOrderItem(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.productId === "string" &&
    typeof value.name === "string" &&
    typeof value.quantity === "number" &&
    isMoney(value.unit) &&
    isMoney(value.lineTotal)
  );
}

function isOrder(value: unknown): value is Order {
  if (!isRecord(value)) return false;
  if (typeof value.reference !== "string" || typeof value.createdAt !== "string") {
    return false;
  }
  if (!isRecord(value.customer)) return false;
  if (
    typeof value.customer.name !== "string" ||
    typeof value.customer.phone !== "string" ||
    typeof value.customer.city !== "string" ||
    typeof value.customer.address !== "string"
  ) {
    return false;
  }
  if (!Array.isArray(value.items) || !value.items.every(isOrderItem)) return false;
  if (!isMoney(value.totals)) return false;
  if (typeof value.paymentMethod !== "string" || !isPaymentMethodId(value.paymentMethod)) {
    return false;
  }
  if (typeof value.status !== "string" || !isOrderStatus(value.status)) return false;
  return value.demo === true;
}

export function parseOrders(value: unknown): Order[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isOrder);
}

export function loadOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? parseOrders(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  try {
    const next = [
      order,
      ...loadOrders().filter((item) => item.reference !== order.reference),
    ].slice(0, MAX_STORED_ORDERS);
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Stockage indisponible : la commande reste affichée pour la session.
  }
}

export function findOrder(reference: string): Order | undefined {
  const normalized = reference.trim().toUpperCase();
  if (!normalized) return undefined;
  return loadOrders().find((order) => order.reference === normalized);
}

export function updateOrderStatus(
  reference: string,
  status: OrderStatus,
): Order | undefined {
  const orders = loadOrders();
  const index = orders.findIndex((order) => order.reference === reference);
  if (index === -1) return undefined;

  const updated: Order = { ...orders[index], status };
  orders[index] = updated;

  try {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    return undefined;
  }

  return updated;
}
