import { logoMeta, type PaymentLogoId } from "@/lib/payment";

export function PaymentLogo({
  id,
  available,
  className = "",
}: {
  id: PaymentLogoId;
  available: boolean;
  className?: string;
}) {
  const meta = logoMeta[id];

  if (available) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/logos/${id}.svg`}
        alt=""
        className={`h-6 w-auto ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${className}`}
      style={{ color: meta.tone, borderColor: `${meta.tone}66` }}
    >
      {meta.label}
    </span>
  );
}
