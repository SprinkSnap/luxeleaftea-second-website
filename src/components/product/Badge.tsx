import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  "Best Seller": "bg-brand-forest text-white",
  "Staff Pick": "bg-brand-gold text-brand-ink",
  New: "bg-brand-leaf text-white",
  "Limited Harvest": "bg-brand-amber text-white",
  "Low Stock": "bg-white text-brand-forest border border-brand-forest/20",
  Organic: "bg-brand-mist text-brand-forest",
};

export function Badge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium tracking-[0.04em]",
        styles[label] || "bg-brand-mist text-brand-forest",
        className,
      )}
    >
      {label}
    </span>
  );
}
