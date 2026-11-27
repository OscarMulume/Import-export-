"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  addLine,
  cartCount,
  cartTotals,
  CART_STORAGE_KEY,
  parseCart,
  removeLine,
  resolveCart,
  setLineQuantity,
  type CartLine,
  type ResolvedCartLine,
} from "./cart";
import type { Money } from "./money";

const EMPTY_CART: CartLine[] = [];

let cachedRaw: string | null | undefined;
let cachedLines: CartLine[] = EMPTY_CART;

function readCart(): CartLine[] {
  if (typeof window === "undefined") return EMPTY_CART;

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    raw = null;
  }

  if (raw === cachedRaw) return cachedLines;

  cachedRaw = raw;
  if (!raw) {
    cachedLines = EMPTY_CART;
    return cachedLines;
  }

  try {
    cachedLines = parseCart(JSON.parse(raw));
  } catch {
    cachedLines = EMPTY_CART;
  }
  return cachedLines;
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  function handleStorage(event: StorageEvent) {
    if (event.key === CART_STORAGE_KEY) {
      cachedRaw = undefined;
      listener();
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function emit(): void {
  for (const listener of listeners) listener();
}

function writeCart(lines: CartLine[]): void {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Stockage indisponible : le panier reste en mémoire pour la session.
  }
  cachedRaw = undefined;
  emit();
}

function getServerSnapshot(): CartLine[] {
  return EMPTY_CART;
}

function getClientReady(): boolean {
  return true;
}

function getServerReady(): boolean {
  return false;
}

type CartContextValue = {
  lines: CartLine[];
  resolved: ResolvedCartLine[];
  ready: boolean;
  count: number;
  totals: Money;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, readCart, getServerSnapshot);
  const ready = useSyncExternalStore(subscribe, getClientReady, getServerReady);

  const add = useCallback((productId: string, quantity = 1) => {
    writeCart(addLine(readCart(), productId, quantity));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    writeCart(setLineQuantity(readCart(), productId, quantity));
  }, []);

  const remove = useCallback((productId: string) => {
    writeCart(removeLine(readCart(), productId));
  }, []);

  const clear = useCallback(() => {
    writeCart([]);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      resolved: resolveCart(lines),
      ready,
      count: cartCount(lines),
      totals: cartTotals(lines),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [lines, ready, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur de CartProvider.");
  }
  return context;
}
