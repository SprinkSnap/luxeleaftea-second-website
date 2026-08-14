"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ecommerce, track } from "@/lib/analytics";
import {
  canadianProvinces,
  hasSupportPhone,
  mailtoHref,
  siteConfig,
  supportedCountries,
  telHref,
} from "@/lib/site";
import { stripeEnabledClientHint } from "@/lib/stripe-public";

export function CheckoutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState(siteConfig.defaultCountry || "CA");
  const [isGift, setIsGift] = useState(false);
  const isCanada = country === "CA";

  const expressHint = useMemo(() => stripeEnabledClientHint(), []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    // Do not send PII fields into analytics — only a sanitized signal
    ecommerce.beginCheckout({
      currency: siteConfig.currency,
      has_gift: Boolean(payload.isGift),
      country: String(payload.country || ""),
    });
    track("add_shipping_info", {
      currency: siteConfig.currency,
      country: String(payload.country || ""),
    });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        track("add_payment_info", {
          currency: siteConfig.currency,
          mode: data.mode,
        });
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
    <div className="space-y-8">
      {expressHint && (
        <section
          aria-labelledby="express-checkout-heading"
          className="rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-brand-mist/50 p-4"
        >
          <h2
            id="express-checkout-heading"
            className="text-sm font-medium text-brand-forest"
          >
            Express checkout
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            After you continue, Stripe Checkout may offer Apple Pay, Google Pay,
            Link, or cards when enabled for this store — no account required.
          </p>
        </section>
      )}

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <section aria-labelledby="contact-heading">
          <h2
            id="contact-heading"
            className="font-display text-2xl text-brand-forest-deep"
          >
            Contact
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Guest checkout — we only use this for your order.
          </p>
          <label className="mt-4 block text-sm">
            <span className="mb-1 block text-brand-muted">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
            />
          </label>
        </section>

        <section aria-labelledby="delivery-heading">
          <h2
            id="delivery-heading"
            className="font-display text-2xl text-brand-forest-deep"
          >
            Delivery
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block text-brand-muted">Full name</span>
              <input
                name="name"
                required
                autoComplete="name"
                className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block text-brand-muted">Address</span>
              <input
                name="line1"
                required
                autoComplete="address-line1"
                className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block text-brand-muted">
                Unit / Apartment{" "}
                <span className="text-brand-muted/70">(optional)</span>
              </span>
              <input
                name="line2"
                autoComplete="address-line2"
                className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-brand-muted">City</span>
              <input
                name="city"
                required
                autoComplete="address-level2"
                className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-brand-muted">
                {isCanada ? "Province / Territory" : "State / Region"}
              </span>
              {isCanada ? (
                <select
                  name="region"
                  required
                  autoComplete="address-level1"
                  defaultValue=""
                  className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white px-3"
                >
                  <option value="" disabled>
                    Select province
                  </option>
                  {canadianProvinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name="region"
                  required
                  autoComplete="address-level1"
                  className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
                />
              )}
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-brand-muted">Postal code</span>
              <input
                name="postalCode"
                required
                autoComplete="postal-code"
                className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-brand-muted">Country</span>
              <select
                name="country"
                required
                autoComplete="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white px-3"
              >
                {supportedCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block text-brand-muted">
                Phone{" "}
                <span className="text-brand-muted/70">(optional)</span>
              </span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
              />
            </label>
          </div>
        </section>

        <section aria-labelledby="gift-heading">
          <h2 id="gift-heading" className="sr-only">
            Gift options
          </h2>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isGift"
              value="true"
              checked={isGift}
              onChange={(e) => setIsGift(e.target.checked)}
            />
            This is a gift
          </label>
          {isGift && (
            <label className="mt-3 block text-sm">
              <span className="mb-1 block text-brand-muted">
                Gift message (optional)
              </span>
              <textarea
                name="giftMessage"
                rows={3}
                className="w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3 py-2"
              />
            </label>
          )}
        </section>

        {error && (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white/70 p-4 text-sm text-brand-muted">
          <p className="font-medium text-brand-ink">Secure checkout</p>
          <ul className="space-y-1.5 text-xs">
            <li>Encrypted payment via Stripe when connected</li>
            <li>Prices in {siteConfig.currency}</li>
            <li>
              <Link href="/returns" className="underline underline-offset-2">
                Returns policy
              </Link>
            </li>
            <li>
              Need help?{" "}
              <Link href="/contact" className="underline underline-offset-2">
                Contact us
              </Link>
              {hasSupportPhone() && (
                <>
                  {" · "}
                  <a
                    href={telHref()}
                    className="underline underline-offset-2"
                    data-analytics="checkout_call"
                  >
                    Call
                  </a>
                </>
              )}
              {" · "}
              <a
                href={mailtoHref("Checkout help")}
                className="underline underline-offset-2"
                data-analytics="checkout_email"
              >
                Email
              </a>
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-[var(--radius-md)] bg-cta text-sm font-semibold text-[var(--cta-text)] hover:bg-cta-hover disabled:opacity-60"
        >
          {loading ? "Processing…" : "Continue to secure payment"}
        </button>
        <p className="text-center text-xs text-brand-muted">
          Tax is calculated at payment based on your delivery address — we do
          not guess a flat Canadian rate.
        </p>
      </form>
    </div>
  );
}
