"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import {
  freeShippingLabel,
  hasSupportPhone,
  mailtoHref,
  siteConfig,
  telHref,
} from "@/lib/site";
import { formatMoney } from "@/lib/utils";
import { ecommerce } from "@/lib/analytics";

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
  const trackedOpen = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      trackedOpen.current = false;
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    if (!trackedOpen.current) {
      ecommerce.viewCart({
        currency: siteConfig.currency,
        value: subtotal / 100,
        item_count: items.length,
      });
      trackedOpen.current = true;
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart, subtotal, items.length]);

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
            className="inline-flex h-11 w-11 items-center justify-center rounded-md"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-[var(--brand-line)] px-5 py-3">
          <p className="text-sm text-brand-muted">
            {remaining === 0
              ? "You’ve unlocked free shipping."
              : `${formatMoney(remaining)} more for free shipping`}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-mist">
            <div
              className="h-full bg-brand-gold transition-[width] duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-brand-muted">
            {freeShippingLabel()}
          </p>
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
                        className="h-11 min-w-[3.5rem] rounded border border-[var(--brand-line)] px-2 text-sm"
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
                        className="min-h-11 px-2 text-sm text-brand-muted underline"
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
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--brand-line)] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="mb-1 flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatMoney(subtotal)}</span>
            </div>
            <p className="mb-3 text-xs text-brand-muted">
              Shipping and tax calculated at checkout · Prices in{" "}
              {siteConfig.currency}
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-cta text-sm font-semibold text-[var(--cta-text)] hover:bg-cta-hover"
            >
              {checkoutLabel}
            </Link>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-3 flex h-11 items-center justify-center text-sm font-medium text-brand-forest underline-offset-2 hover:underline"
            >
              Continue Shopping
            </Link>
            <p className="mt-3 text-center text-xs text-brand-muted">
              Need help?{" "}
              <Link href="/contact" onClick={closeCart} className="underline">
                Contact
              </Link>
              {hasSupportPhone() && (
                <>
                  {" · "}
                  <a href={telHref()} className="underline">
                    Call
                  </a>
                </>
              )}
              {" · "}
              <a href={mailtoHref("Cart help")} className="underline">
                Email
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
