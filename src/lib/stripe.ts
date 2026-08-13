import Stripe from "stripe";
import { siteConfig } from "@/lib/site";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
    // The Workers runtime has no Node HTTP stack, so use the fetch-based
    // client. Stripe.createFetchHttpClient() works in Node too.
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export function stripeEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function absoluteUrl(path: string) {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
