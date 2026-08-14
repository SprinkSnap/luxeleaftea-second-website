"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { StockIndicator } from "@/components/product/StockIndicator";
import { formatMoney } from "@/lib/utils";

export function AddToCartPanel({
  variantId,
  price,
  packageSize,
  stockAvailable,
  lowStock,
  sizes,
  cupsEstimate,
}: {
  variantId: string;
  price: number;
  packageSize: string;
  stockAvailable: number;
  lowStock: boolean;
  sizes: { id: string; label: string; price: number; stock: number }[];
  cupsEstimate?: number | null;
}) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState(variantId);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [notifyDone, setNotifyDone] = useState(false);

  const current = sizes.find((s) => s.id === selected) || sizes[0];
  const available = current?.stock ?? stockAvailable;

  async function onAdd() {
    if (!current) return;
    setLoading(true);
    setError(null);
    try {
      await addItem(current.id, qty);
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add to cart");
    } finally {
      setLoading(false);
    }
  }

  async function onNotify(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/inventory/back-in-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: current?.id, email, consent: true }),
    });
    if (res.ok) setNotifyDone(true);
  }

  const ctaLabel = loading
    ? "Adding…"
    : added
      ? "Added to cart"
      : `Add to Cart — ${formatMoney(current?.price ?? price)}`;

  return (
    <>
      <div className="space-y-5">
        <div>
          <p className="font-display text-3xl text-brand-forest-deep">
            {formatMoney(current?.price ?? price)}
          </p>
          <p className="mt-1 text-sm text-brand-muted">
            {current?.label || packageSize}
            {cupsEstimate ? ` · ~${cupsEstimate} cups` : ""}
          </p>
        </div>

        {sizes.length > 1 && (
          <div>
            <p className="mb-2 text-sm font-medium">Package size</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Package size">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelected(size.id)}
                  className={
                    selected === size.id
                      ? "rounded-md border border-brand-forest bg-brand-forest px-3 py-2 text-sm text-white"
                      : "rounded-md border border-[var(--brand-line)] px-3 py-2 text-sm"
                  }
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <StockIndicator available={available} lowStock={lowStock} />

        {available > 0 ? (
          <div className="flex gap-3">
            <label className="sr-only" htmlFor="qty">
              Quantity
            </label>
            <select
              id="qty"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="h-12 rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white px-3"
            >
              {Array.from({ length: Math.min(available, 10) }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onAdd}
              disabled={loading}
              className="h-12 flex-1 rounded-[var(--radius-md)] bg-cta text-sm font-semibold tracking-[0.04em] text-[var(--cta-text)] hover:bg-cta-hover"
              aria-live="polite"
            >
              {loading ? "Adding…" : added ? "Added to cart" : "Add to Cart"}
            </button>
          </div>
        ) : (
          <form onSubmit={onNotify} className="space-y-3">
            <p className="text-sm text-brand-muted">
              This size is unavailable. Get notified when it returns.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
            />
            <button
              type="submit"
              className="h-12 w-full rounded-[var(--radius-md)] bg-brand-forest text-sm font-medium text-white"
            >
              Notify Me When Available
            </button>
            {notifyDone && (
              <p className="text-sm text-brand-forest" role="status">
                We’ll email you when it’s back.
              </p>
            )}
          </form>
        )}
        {error && (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        <ul className="space-y-1.5 text-xs text-brand-muted">
          <li>Free shipping on orders over $50</li>
          <li>Secure checkout · Guest checkout welcome</li>
          <li>
            <Link href="/returns" className="underline-offset-2 hover:underline">
              Returns &amp; exchanges
            </Link>
          </li>
        </ul>
      </div>

      {available > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--brand-line)] bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
          <button
            type="button"
            onClick={onAdd}
            disabled={loading}
            className="h-12 w-full rounded-[var(--radius-md)] bg-cta text-sm font-semibold text-[var(--cta-text)]"
            aria-live="polite"
          >
            {ctaLabel}
          </button>
        </div>
      )}
    </>
  );
}
