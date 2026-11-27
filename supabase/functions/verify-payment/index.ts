// Fonction Edge Supabase — vérification serveur d'une transaction Flutterwave.
// Miroir de src/lib/payments/flutterwave-verify.ts (testé côté application).
//
// Déploiement :
//   supabase functions deploy verify-payment
//   supabase secrets set FLUTTERWAVE_SECRET_KEY=...
// Puis renseigner NEXT_PUBLIC_PAYMENT_VERIFY_URL avec l'URL de la fonction.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Input = {
  transactionId: string;
  reference: string;
  amount: number;
  currency: "USD" | "CDF";
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (request.method !== "POST") {
    return json({ verified: false, reason: "method_not_allowed" }, 405);
  }

  let input: Input;
  try {
    input = (await request.json()) as Input;
  } catch {
    return json({ verified: false, reason: "invalid_json" }, 400);
  }

  if (
    !input ||
    typeof input.transactionId !== "string" ||
    typeof input.reference !== "string" ||
    typeof input.amount !== "number" ||
    input.amount <= 0 ||
    (input.currency !== "USD" && input.currency !== "CDF")
  ) {
    return json({ verified: false, reason: "invalid_input" }, 400);
  }

  const secretKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY") ?? "";
  if (!secretKey) {
    return json({ verified: false, reason: "missing_secret" }, 500);
  }

  let response: Response;
  try {
    response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(input.transactionId)}/verify`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch {
    return json({ verified: false, reason: "network_error" }, 502);
  }

  if (!response.ok) {
    return json({ verified: false, reason: "http_error" }, 502);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return json({ verified: false, reason: "invalid_response" }, 502);
  }

  const data = (payload as { data?: Record<string, unknown> } | null)?.data;
  if (!data || typeof data !== "object") {
    return json({ verified: false, reason: "invalid_response" }, 502);
  }

  if (data.status !== "successful") {
    return json({ verified: false, reason: "not_successful" }, 422);
  }
  if (data.tx_ref !== input.reference) {
    return json({ verified: false, reason: "reference_mismatch" }, 422);
  }
  if (data.currency !== input.currency) {
    return json({ verified: false, reason: "currency_mismatch" }, 422);
  }

  const amount = typeof data.amount === "number" ? data.amount : Number(data.amount);
  if (!Number.isFinite(amount) || amount + 0.01 < input.amount) {
    return json({ verified: false, reason: "amount_mismatch" }, 422);
  }

  return json({
    verified: true,
    transaction: {
      id: data.id,
      status: data.status,
      amount,
      currency: data.currency,
      txRef: data.tx_ref,
    },
  });
});
