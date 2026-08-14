import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

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
        Open the cart from the header for the full experience — quantities,
        free-shipping progress, and checkout. Prices in {siteConfig.currency}.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
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
        <Link
          href="/contact"
          className="inline-flex h-11 items-center px-3 text-sm font-medium text-brand-forest underline-offset-2 hover:underline"
        >
          Need help?
        </Link>
      </div>
    </div>
  );
}
