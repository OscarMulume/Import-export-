import { describe, expect, it, vi } from "vitest";
import { verifyFlutterwaveTransaction } from "./flutterwave-verify";

const validInput = {
  transactionId: "123456",
  expectedReference: "IE-20261127-ABCD",
  expectedAmount: 26,
  expectedCurrency: "USD" as const,
};

function mockFetch(payload: unknown, ok = true, status = 200) {
  return vi.fn(async () =>
    new Response(JSON.stringify(payload), {
      status: ok ? status : 500,
      headers: { "Content-Type": "application/json" },
    }),
  ) as unknown as typeof fetch;
}

describe("verifyFlutterwaveTransaction", () => {
  it("refuse sans clé secrète et n'appelle pas l'API", async () => {
    const fetchImpl = mockFetch({});
    const result = await verifyFlutterwaveTransaction(validInput, {
      secretKey: "",
      fetchImpl,
    });
    expect(result).toEqual({ verified: false, reason: "missing_secret" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("accepte une transaction réussie, même référence et bon montant", async () => {
    const fetchImpl = mockFetch({
      status: "success",
      data: {
        id: 123456,
        status: "successful",
        amount: 26,
        currency: "USD",
        tx_ref: validInput.expectedReference,
      },
    });
    const result = await verifyFlutterwaveTransaction(validInput, {
      secretKey: "FLWSECK_TEST",
      fetchImpl,
    });
    expect(result.verified).toBe(true);
    expect(result.transaction?.txRef).toBe(validInput.expectedReference);
  });

  it("refuse une transaction non réussie", async () => {
    const fetchImpl = mockFetch({
      data: {
        id: 1,
        status: "failed",
        amount: 26,
        currency: "USD",
        tx_ref: validInput.expectedReference,
      },
    });
    const result = await verifyFlutterwaveTransaction(validInput, {
      secretKey: "FLWSECK_TEST",
      fetchImpl,
    });
    expect(result).toEqual({ verified: false, reason: "not_successful" });
  });

  it("refuse une référence différente", async () => {
    const fetchImpl = mockFetch({
      data: {
        id: 1,
        status: "successful",
        amount: 26,
        currency: "USD",
        tx_ref: "IE-AUTRE",
      },
    });
    const result = await verifyFlutterwaveTransaction(validInput, {
      secretKey: "FLWSECK_TEST",
      fetchImpl,
    });
    expect(result).toEqual({ verified: false, reason: "reference_mismatch" });
  });

  it("refuse un montant insuffisant", async () => {
    const fetchImpl = mockFetch({
      data: {
        id: 1,
        status: "successful",
        amount: 10,
        currency: "USD",
        tx_ref: validInput.expectedReference,
      },
    });
    const result = await verifyFlutterwaveTransaction(validInput, {
      secretKey: "FLWSECK_TEST",
      fetchImpl,
    });
    expect(result).toEqual({ verified: false, reason: "amount_mismatch" });
  });

  it("refuse une devise différente", async () => {
    const fetchImpl = mockFetch({
      data: {
        id: 1,
        status: "successful",
        amount: 26,
        currency: "CDF",
        tx_ref: validInput.expectedReference,
      },
    });
    const result = await verifyFlutterwaveTransaction(validInput, {
      secretKey: "FLWSECK_TEST",
      fetchImpl,
    });
    expect(result).toEqual({ verified: false, reason: "currency_mismatch" });
  });

  it("refuse une erreur HTTP", async () => {
    const fetchImpl = mockFetch({}, false);
    const result = await verifyFlutterwaveTransaction(validInput, {
      secretKey: "FLWSECK_TEST",
      fetchImpl,
    });
    expect(result).toEqual({ verified: false, reason: "http_error" });
  });

  it("refuse une entrée invalide", async () => {
    const result = await verifyFlutterwaveTransaction(
      { ...validInput, expectedAmount: 0 },
      { secretKey: "FLWSECK_TEST", fetchImpl: mockFetch({}) },
    );
    expect(result).toEqual({ verified: false, reason: "invalid_input" });
  });
});
