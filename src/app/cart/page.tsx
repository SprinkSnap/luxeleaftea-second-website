import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Cart",
  description: "Review your Lux Leaf Tea cart.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <div className="container-page px-4 py-16 text-center">
      <h1 className="font-display text-4xl">Your Cart</h1>
      <p className="mt-3 text-brand-muted">
        Use the cart drawer for the fastest experience — or continue to checkout.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/shop"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] border border-[var(--brand-line)] px-5 text-sm"
        >
          Continue shopping
        </Link>
        <Link
          href="/checkout"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] bg-cta px-5 text-sm font-medium text-[var(--cta-text)]"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
