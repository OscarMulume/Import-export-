import type { Product } from "@/lib/catalogue";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProductVisual({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${product.tone.from}, ${product.tone.to})`,
      }}
    >
      <span className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_10%,rgba(255,255,255,0.35),transparent_55%)]" />
      <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-sm font-bold text-white backdrop-blur">
        {initials(product.name)}
      </span>
      <span className="absolute bottom-3 left-3 rounded-full bg-black/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/90">
        Visuel temporaire
      </span>
    </div>
  );
}
