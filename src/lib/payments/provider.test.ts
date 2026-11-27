import { afterEach, describe, expect, it, vi } from "vitest";
import type { Order } from "@/lib/order";
import { isFlutterwaveConfigured, resolvePaymentProvider } from "./provider";

const fakeOrder = { reference: "IE-TEST" } as Order;

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("resolvePaymentProvider", () => {
  it("utilise le mobile money manuel pour les opérateurs", () => {
    const provider = resolvePaymentProvider("mpesa");
    expect(provider.id).toBe("manual");
    expect(provider.initiate(fakeOrder)).toEqual({ kind: "manual" });
  });

  it("signale Flutterwave non configuré pour la carte sans clés", () => {
    vi.stubEnv("NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_PAYMENT_VERIFY_URL", "");
    expect(isFlutterwaveConfigured()).toBe(false);
    const result = resolvePaymentProvider("card").initiate(fakeOrder);
    expect(result.kind).toBe("unconfigured");
  });

  it("ouvre le checkout Flutterwave quand les clés sont présentes", () => {
    vi.stubEnv("NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY", "FLWPUBK_TEST");
    vi.stubEnv("NEXT_PUBLIC_PAYMENT_VERIFY_URL", "https://example.test/verify");
    expect(isFlutterwaveConfigured()).toBe(true);
    const result = resolvePaymentProvider("card").initiate(fakeOrder);
    expect(result).toEqual({ kind: "checkout" });
  });
});
