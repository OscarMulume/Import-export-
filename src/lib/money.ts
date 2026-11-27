export type Currency = "USD" | "CDF";

export type Money = {
  usd: number;
  cdf: number;
};

const usdFormatter = new Intl.NumberFormat("fr-CD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const cdfFormatter = new Intl.NumberFormat("fr-CD", {
  maximumFractionDigits: 0,
});

export function roundUsd(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function roundCdf(value: number): number {
  return Math.round(value);
}

export function formatUsd(value: number): string {
  return `${usdFormatter.format(roundUsd(value))} $`;
}

export function formatCdf(value: number): string {
  return `${cdfFormatter.format(roundCdf(value))} FC`;
}

export function formatMoney(value: number, currency: Currency): string {
  return currency === "USD" ? formatUsd(value) : formatCdf(value);
}

export function formatDualPrice(price: Money): string {
  return `${formatUsd(price.usd)} · ${formatCdf(price.cdf)}`;
}

export function multiplyPrice(price: Money, quantity: number): Money {
  const safeQuantity = Math.max(0, Math.floor(quantity));
  return {
    usd: roundUsd(price.usd * safeQuantity),
    cdf: roundCdf(price.cdf * safeQuantity),
  };
}

export function addPrices(prices: Money[]): Money {
  return prices.reduce<Money>(
    (total, price) => ({
      usd: roundUsd(total.usd + price.usd),
      cdf: roundCdf(total.cdf + price.cdf),
    }),
    { usd: 0, cdf: 0 },
  );
}

export function isValidQuantity(quantity: number, max = 99): boolean {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= max;
}
