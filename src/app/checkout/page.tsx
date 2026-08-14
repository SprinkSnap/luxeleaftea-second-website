import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { cartItemCount, cartSubtotal, getCart } from "@/lib/cart";
import {
  formatMoney,
  parseJsonArray,
  shippingCostForSubtotal,
} from "@/lib/utils";
import {
  freeShippingLabel,
  mailtoHref,
  siteConfig,
} from "@/lib/site";

export const metadata = createMetadata({
  title: "Checkout",
  description: "Secure Lux Leaf Tea checkout with guest support. Prices in CAD.",
  path: "/checkout",
  noIndex: true,
});

export default async function CheckoutPage() {
  const cart = await getCart();
  if (!cart || !cartItemCount(cart)) {
    return (
      <div className="container-page px-4 py-20 text-center">
        <h1 className="font-display text-4xl">Your cart is empty</h1>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-12 items-center rounded-[var(--radius-md)] bg-cta px-5 text-sm font-medium text-[var(--cta-text)]"
        >
          Shop Tea
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(cart);
  const shipping = shippingCostForSubtotal(subtotal);
  const remaining = Math.max(0, siteConfig.freeShippingThreshold - subtotal);

  return (
    <div className="min-h-[70vh] bg-brand-cream/40">
      <div className="container-wide grid gap-10 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-12">
        <div>
          <h1 className="font-display text-4xl">Checkout</h1>
          <p className="mt-2 text-brand-muted">
            Guest checkout by default. No account required to pay. Prices in{" "}
            {siteConfig.currency}.
          </p>
          <div className="mt-8">
            <CheckoutForm />
          </div>
        </div>

        <aside className="h-fit rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-white/90 p-5 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm">
                <span>
                  {item.variant.product.name} × {item.quantity}
                  <span className="block text-brand-muted">
                    {item.variant.packageSize}
                  </span>
                </span>
                <span>
                  {formatMoney(item.variant.retailPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-[var(--brand-line)] pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatMoney(shipping)}</dd>
            </div>
            {remaining > 0 && (
              <p className="text-xs text-brand-muted">
                {formatMoney(remaining)} more for free shipping ·{" "}
                {freeShippingLabel()}
              </p>
            )}
            <div className="flex justify-between text-brand-muted">
              <dt>Tax</dt>
              <dd className="text-right text-xs sm:text-sm">
                Calculated at payment
              </dd>
            </div>
            <div className="flex justify-between text-base font-medium">
              <dt>Estimated total</dt>
              <dd>{formatMoney(subtotal + shipping)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-brand-muted">
            Final tax depends on your province or territory and is shown by
            Stripe before you pay.{" "}
            <Link href="/returns" className="underline">
              Returns policy
            </Link>
            {" · "}
            <a href={mailtoHref("Order help")} className="underline">
              Email us
            </a>
          </p>
          <p className="sr-only">
            Images:{" "}
            {cart.items
              .map((i) => parseJsonArray(i.variant.product.images)[0])
              .join(", ")}
          </p>
        </aside>
      </div>
    </div>
  );
}
