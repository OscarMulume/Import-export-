"use client";

import { useCart } from "@/lib/cart-context";

export function CartCount() {
  const { count, ready } = useCart();

  if (!ready || count === 0) return null;

  return (
    <span
      className="ml-1 inline-grid min-w-5 place-items-center rounded-full bg-white/25 px-1.5 text-[11px] font-bold"
      aria-label={`${count} article${count > 1 ? "s" : ""} dans le panier`}
    >
      {count}
    </span>
  );
}
