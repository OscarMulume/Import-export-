export const ACCOUNT_STORAGE_KEY = "ie.account.v1";

export type DemoAccount = {
  email: string;
  createdAt: string;
  demo: true;
};

export function loadAccount(): DemoAccount | null {
  try {
    const raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === "object" &&
      value !== null &&
      typeof (value as { email?: unknown }).email === "string" &&
      typeof (value as { createdAt?: unknown }).createdAt === "string"
    ) {
      const { email, createdAt } = value as { email: string; createdAt: string };
      return { email, createdAt, demo: true };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveAccount(email: string): DemoAccount {
  const account: DemoAccount = {
    email: email.trim(),
    createdAt: new Date().toISOString(),
    demo: true,
  };
  try {
    window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  } catch {
    // Stockage indisponible : le compte reste en mémoire pour la session.
  }
  return account;
}

export function clearAccount(): void {
  try {
    window.localStorage.removeItem(ACCOUNT_STORAGE_KEY);
  } catch {
    // Rien à faire si le stockage est indisponible.
  }
}
