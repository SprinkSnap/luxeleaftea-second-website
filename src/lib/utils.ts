import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/lib/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format money from integer cents. Defaults to CAD / en-CA.
 * Customer-facing copy always includes a currency code so visitors
 * never assume USD when browsing a Canadian storefront.
 */
export function formatMoney(
  cents: number,
  currency = siteConfig.currency || "CAD",
  options?: { showCode?: boolean },
) {
  const locale = (siteConfig.locale || "en-CA").replace("_", "-");
  const code = (currency || "CAD").toUpperCase();
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
  }).format(cents / 100);

  // en-CA already yields "$24.00"; append CAD for clarity unless disabled.
  const showCode = options?.showCode !== false;
  if (!showCode) return formatted;
  if (formatted.includes(code)) return formatted;
  return `${formatted} ${code}`;
}

/** Stripe / payment APIs expect lowercase ISO currency codes. */
export function stripeCurrency(currency = siteConfig.currency || "CAD") {
  return currency.toLowerCase();
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function stockAvailable(stockOnHand: number, stockReserved: number) {
  return Math.max(0, stockOnHand - stockReserved);
}

export function shippingCostForSubtotal(subtotalCents: number) {
  if (subtotalCents <= 0) return 0;
  if (subtotalCents >= siteConfig.freeShippingThreshold) return 0;
  return siteConfig.standardShippingCents;
}
