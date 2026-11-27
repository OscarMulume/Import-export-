export const paymentLogoIds = [
  "mpesa",
  "airtel",
  "orange",
  "afrimoney",
  "flutterwave",
  "visa",
  "mastercard",
] as const;

export type PaymentLogoId = (typeof paymentLogoIds)[number];

export type LogoMeta = {
  label: string;
  tone: string;
};

export const logoMeta: Record<PaymentLogoId, LogoMeta> = {
  mpesa: { label: "M-Pesa", tone: "#e30613" },
  airtel: { label: "Airtel Money", tone: "#e40000" },
  orange: { label: "Orange Money", tone: "#ff7900" },
  afrimoney: { label: "Afrimoney", tone: "#00a651" },
  flutterwave: { label: "Flutterwave", tone: "#f5a623" },
  visa: { label: "VISA", tone: "#1a1f71" },
  mastercard: { label: "Mastercard", tone: "#eb001b" },
};

export type PaymentMethodId = "mpesa" | "airtel" | "orange" | "afrimoney" | "card";

export type PaymentKind = "mobile_money" | "card";

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  kind: PaymentKind;
  operator?: string;
  logoIds: PaymentLogoId[];
  description: string;
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: "mpesa",
    label: "M-Pesa",
    kind: "mobile_money",
    operator: "Vodacom",
    logoIds: ["mpesa"],
    description: "Mobile money M-Pesa (Vodacom).",
  },
  {
    id: "airtel",
    label: "Airtel Money",
    kind: "mobile_money",
    operator: "Airtel",
    logoIds: ["airtel"],
    description: "Mobile money Airtel Money.",
  },
  {
    id: "orange",
    label: "Orange Money",
    kind: "mobile_money",
    operator: "Orange",
    logoIds: ["orange"],
    description: "Mobile money Orange Money.",
  },
  {
    id: "afrimoney",
    label: "Afrimoney",
    kind: "mobile_money",
    operator: "Africell",
    logoIds: ["afrimoney"],
    description: "Mobile money Afrimoney (Africell).",
  },
  {
    id: "card",
    label: "Carte bancaire",
    kind: "card",
    logoIds: ["flutterwave", "visa", "mastercard"],
    description: "Visa ou Mastercard via Flutterwave.",
  },
];

export function getPaymentMethod(id: PaymentMethodId): PaymentMethod | undefined {
  return paymentMethods.find((method) => method.id === id);
}

export function isPaymentMethodId(value: string): value is PaymentMethodId {
  return paymentMethods.some((method) => method.id === value);
}

const mobileMoneyNumbers: Record<PaymentMethodId, string | undefined> = {
  mpesa: process.env.NEXT_PUBLIC_MPESA_NUMBER,
  airtel: process.env.NEXT_PUBLIC_AIRTEL_NUMBER,
  orange: process.env.NEXT_PUBLIC_ORANGE_NUMBER,
  afrimoney: process.env.NEXT_PUBLIC_AFRIMONEY_NUMBER,
  card: undefined,
};

export function getMobileMoneyNumber(id: PaymentMethodId): string {
  return (mobileMoneyNumbers[id] ?? "").trim();
}
