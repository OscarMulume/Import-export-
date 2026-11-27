import { resolveCart, type CartLine } from "./cart";
import { addPrices, type Money } from "./money";
import type { PaymentMethodId } from "./payment";

export type OrderStatus =
  | "pending_payment"
  | "awaiting_confirmation"
  | "paid"
  | "cancelled";

export type OrderCustomer = {
  name: string;
  phone: string;
  city: string;
  address: string;
  email?: string;
  notes?: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unit: Money;
  lineTotal: Money;
};

export type Order = {
  reference: string;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  totals: Money;
  paymentMethod: PaymentMethodId;
  status: OrderStatus;
  accountEmail?: string;
  demo: true;
};

export type CustomerErrors = Partial<Record<keyof OrderCustomer, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+]?[\d\s().-]+$/;

export function validateCustomer(input: Partial<OrderCustomer>): CustomerErrors {
  const errors: CustomerErrors = {};

  const name = (input.name ?? "").trim();
  const phone = (input.phone ?? "").trim();
  const city = (input.city ?? "").trim();
  const address = (input.address ?? "").trim();
  const email = (input.email ?? "").trim();

  if (name.length < 2) {
    errors.name = "Indiquez votre nom (2 caractères minimum).";
  }

  const digits = phone.replace(/\D/g, "");
  if (!PHONE_PATTERN.test(phone) || digits.length < 8 || digits.length > 15) {
    errors.phone = "Indiquez un numéro de téléphone valide.";
  }

  if (city.length < 2) {
    errors.city = "Indiquez votre ville.";
  }

  if (address.length < 5) {
    errors.address = "Indiquez une adresse de livraison.";
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Indiquez une adresse e-mail valide.";
  }

  return errors;
}

export function generateOrderReference(now = new Date(), random = Math.random): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const suffix = Math.floor(random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
  return `IE-${year}${month}${day}-${suffix}`;
}

export function buildOrder({
  customer,
  lines,
  paymentMethod,
  accountEmail,
  now = new Date(),
  random = Math.random,
}: {
  customer: OrderCustomer;
  lines: CartLine[];
  paymentMethod: PaymentMethodId;
  accountEmail?: string;
  now?: Date;
  random?: () => number;
}): Order {
  const resolved = resolveCart(lines);
  if (resolved.length === 0) {
    throw new Error("Le panier est vide.");
  }

  const items: OrderItem[] = resolved.map(({ product, quantity, lineTotal }) => ({
    productId: product.id,
    name: product.name,
    quantity,
    unit: product.price,
    lineTotal,
  }));

  return {
    reference: generateOrderReference(now, random),
    createdAt: now.toISOString(),
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      city: customer.city.trim(),
      address: customer.address.trim(),
      email: customer.email?.trim() || undefined,
      notes: customer.notes?.trim() || undefined,
    },
    items,
    totals: addPrices(items.map((item) => item.lineTotal)),
    paymentMethod,
    status: "pending_payment",
    accountEmail: accountEmail?.trim() || undefined,
    demo: true,
  };
}

export function orderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending_payment":
      return "En attente de paiement";
    case "awaiting_confirmation":
      return "Paiement à confirmer";
    case "paid":
      return "Payée";
    case "cancelled":
      return "Annulée";
  }
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (
    value === "pending_payment" ||
    value === "awaiting_confirmation" ||
    value === "paid" ||
    value === "cancelled"
  );
}
