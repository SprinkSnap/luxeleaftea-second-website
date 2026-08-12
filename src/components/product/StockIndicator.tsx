import { cn } from "@/lib/utils";

export function StockIndicator({
  available,
  lowStock,
  className,
}: {
  available: number;
  lowStock?: boolean;
  className?: string;
}) {
  if (available <= 0) {
    return (
      <p className={cn("text-sm text-red-700", className)} role="status">
        Out of stock
      </p>
    );
  }
  if (lowStock) {
    return (
      <p className={cn("text-sm text-amber-800", className)} role="status">
        Low stock — {available} left
      </p>
    );
  }
  return (
    <p className={cn("text-sm text-brand-forest", className)} role="status">
      In stock
    </p>
  );
}
