/**
 * Client-safe Stripe availability hint.
 * Never expose secret keys — only the publishable key presence.
 */
export function stripeEnabledClientHint() {
  return Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}
