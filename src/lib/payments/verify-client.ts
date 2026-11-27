export type VerifyClientInput = {
  transactionId: string;
  reference: string;
  amount: number;
  currency: "USD" | "CDF";
};

export type VerifyClientResult = {
  verified: boolean;
  reason?: string;
};

/**
 * Appelle l'endpoint serveur de vérification (Edge Function ou autre).
 * Aucun secret n'est présent côté navigateur.
 */
export async function verifyFlutterwavePayment(
  input: VerifyClientInput,
): Promise<VerifyClientResult> {
  const url = process.env.NEXT_PUBLIC_PAYMENT_VERIFY_URL?.trim();
  if (!url) {
    return { verified: false, reason: "not_configured" };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const body = (await response.json().catch(() => null)) as
      | VerifyClientResult
      | null;

    if (!response.ok) {
      return { verified: false, reason: body?.reason ?? "http_error" };
    }

    return { verified: body?.verified === true, reason: body?.reason };
  } catch {
    return { verified: false, reason: "network_error" };
  }
}
