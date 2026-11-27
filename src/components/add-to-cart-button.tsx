"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({
  productId,
  className = "btn btn-primary w-full",
}: {
  productId: string;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function handleClick() {
    add(productId);
    setAdded(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      type="button"
      className={added ? `${className} animate-pop` : className}
      onClick={handleClick}
    >
      <span aria-live="polite">{added ? "Ajouté au panier" : "Ajouter au panier"}</span>
    </button>
  );
}
