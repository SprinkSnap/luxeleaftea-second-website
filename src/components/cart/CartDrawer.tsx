"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { siteConfig } from "@/lib/site";
import { formatMoney } from "@/lib/utils";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    subtotal,
    updateQuantity,
    removeItem,
    checkoutLabel,
  } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const progress = Math.min(1, subtotal / siteConfig.freeShippingThreshold);
  const remaining = Math.max(0, siteConfig.freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-[var(--brand-line)] px-5 py-4">
          <h2 className="font-display text-2xl text-brand-forest">Your Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-[var(--brand-line)] px-5 py-3">
          <p className="text-sm text-brand-muted">
            {remaining === 0
              ? "You’ve unlocked free shipping."
              : `${formatMoney(remaining)} away from free shipping`}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-mist">
            <div
              className="h-full bg-brand-gold transition-[width] duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-xl text-brand-forest">
                Your cart is empty
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-4 inline-flex h-11 items-center rounded-[var(--radius-md)] bg-cta px-5 text-sm font-medium text-[var(--cta-text)]"
              >
                Shop Tea
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative h-24 w-20 overflow-hidden rounded-md bg-brand-mist">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="font-medium text-brand-ink"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-brand-muted">
                      {item.teaType} · {item.packageSize}
                    </p>
                    <p className="mt-1 text-sm">{formatMoney(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="sr-only" htmlFor={`qty-${item.id}`}>
                        Quantity for {item.name}
                      </label>
                      <select
                        id={`qty-${item.id}`}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value))
                        }
                        className="h-9 rounded border border-[var(--brand-line)] px-2 text-sm"
                      >
                        {Array.from({
                          length: Math.max(item.stockAvailable, item.quantity),
                        }).map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="text-sm text-brand-muted underline"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium">
                    {formatMoney(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 && (
            <div className="mt-8 rounded-[var(--radius-md)] bg-brand-mist/70 p-4">
              <p className="text-xs tracking-[0.14em] uppercase text-brand-muted">
                You may also like
              </p>
              <Link
                href="/collections/gifts"
                onClick={closeCart}
                className="mt-2 block text-sm text-brand-forest underline-offset-2 hover:underline"
              >
                Pair with a gift box or tea infuser →
              </Link>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--brand-line)] p-5">
            <div className="mb-3 flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatMoney(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-cta text-sm font-semibold text-[var(--cta-text)] hover:bg-cta-hover"
            >
              {checkoutLabel}
            </Link>
            <p className="mt-2 text-center text-xs text-brand-muted">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
