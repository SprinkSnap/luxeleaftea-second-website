"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ecommerce } from "@/lib/analytics";

export function CheckoutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    ecommerce.beginCheckout(payload);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        if (String(data.url).startsWith("http")) {
          window.location.href = data.url;
        } else {
          router.push(data.url);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block text-brand-muted">Email</span>
          <input
            name="email"
            type="email"
            required
            className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block text-brand-muted">Full name</span>
          <input
            name="name"
            required
            className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block text-brand-muted">Address</span>
          <input
            name="line1"
            required
            autoComplete="street-address"
            className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">City</span>
          <input
            name="city"
            required
            className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">State / Region</span>
          <input
            name="region"
            className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Postal code</span>
          <input
            name="postalCode"
            required
            className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Country</span>
          <input
            name="country"
            defaultValue="US"
            required
            className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isGift" value="true" />
        This is a gift
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-brand-muted">Gift message (optional)</span>
        <textarea
          name="giftMessage"
          rows={3}
          className="w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3 py-2"
        />
      </label>
      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-[var(--radius-md)] bg-cta text-sm font-semibold text-[var(--cta-text)] hover:bg-cta-hover disabled:opacity-60"
      >
        {loading ? "Processing…" : "Continue to payment"}
      </button>
      <p className="text-xs text-brand-muted">
        Apple Pay, Google Pay, Link, and cards are available when Stripe is
        connected for your account.
      </p>
    </form>
  );
}
