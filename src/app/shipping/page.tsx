import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Shipping",
  description: "Lux Leaf Tea shipping information and free-shipping threshold.",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <div className="container-page px-4 py-12 prose-tea">
      <h1 className="font-display text-4xl">Shipping</h1>
      <p className="mt-4 text-brand-muted">
        Orders of $50 or more ship free within the contiguous United States.
        Standard delivery typically arrives in 3–5 business days after dispatch.
      </p>
      <p className="text-brand-muted">
        Shipping rates for Alaska, Hawaii, and international destinations are
        calculated at checkout when available.
      </p>
    </div>
  );
}
