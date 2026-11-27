export type VerifyCurrency = "USD" | "CDF";

export type FlutterwaveVerifyInput = {
  transactionId: string;
  expectedReference: string;
  expectedAmount: number;
  expectedCurrency: VerifyCurrency;
};

export type FlutterwaveTransaction = {
  id: number | string;
  status: string;
  amount: number;
  currency: string;
  txRef: string;
};

export type FlutterwaveVerifyResult = {
  verified: boolean;
  reason?: string;
  transaction?: FlutterwaveTransaction;
};

export type VerifyDependencies = {
  secretKey: string;
  fetchImpl?: typeof fetch;
};

const API_BASE = "https://api.flutterwave.com/v3";

/**
 * Vérifie une transaction Flutterwave côté serveur. Ne jamais se fier au retour
 * du navigateur : seule cette vérification (clé secrète) peut confirmer un paiement.
 *
 * NOTE : logique miroir de la fonction Edge `supabase/functions/verify-payment`.
 */
export async function verifyFlutterwaveTransaction(
  input: FlutterwaveVerifyInput,
  dependencies: VerifyDependencies,
): Promise<FlutterwaveVerifyResult> {
  if (
    !input.transactionId ||
    !input.expectedReference ||
    !Number.isFinite(input.expectedAmount) ||
    input.expectedAmount <= 0 ||
    (input.expectedCurrency !== "USD" && input.expectedCurrency !== "CDF")
  ) {
    return { verified: false, reason: "invalid_input" };
  }

  const secretKey = dependencies.secretKey.trim();
  if (!secretKey) {
    return { verified: false, reason: "missing_secret" };
  }

  const fetchImpl = dependencies.fetchImpl ?? fetch;

  let response: Response;
  try {
    response = await fetchImpl(
      `${API_BASE}/transactions/${encodeURIComponent(input.transactionId)}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );
  } catch {
    return { verified: false, reason: "network_error" };
  }

  if (!response.ok) {
    return { verified: false, reason: "http_error" };
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return { verified: false, reason: "invalid_response" };
  }

  const data = (payload as { data?: unknown } | null)?.data;
  if (!data || typeof data !== "object") {
    return { verified: false, reason: "invalid_response" };
  }

  const record = data as Record<string, unknown>;
  const status = typeof record.status === "string" ? record.status : "";
  const txRef = typeof record.tx_ref === "string" ? record.tx_ref : "";
  const currency = typeof record.currency === "string" ? record.currency : "";
  const amount =
    typeof record.amount === "number" ? record.amount : Number(record.amount);

  if (status !== "successful") {
    return { verified: false, reason: "not_successful" };
  }

  if (txRef !== input.expectedReference) {
    return { verified: false, reason: "reference_mismatch" };
  }

  if (currency !== input.expectedCurrency) {
    return { verified: false, reason: "currency_mismatch" };
  }

  if (!Number.isFinite(amount) || amount + 0.01 < input.expectedAmount) {
    return { verified: false, reason: "amount_mismatch" };
  }

  return {
    verified: true,
    transaction: {
      id: typeof record.id === "number" || typeof record.id === "string" ? record.id : "",
      status,
      amount,
      currency,
      txRef,
    },
  };
}
