import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = createMetadata({
  title: "Shipping",
  description:
    siteConfig.market === "CA"
      ? "Lux Leaf Tea shipping in Canada, including free shipping on orders over $50."
      : "Lux Leaf Tea shipping information and free-shipping threshold.",
  path: "/shipping",
});

export default function ShippingPage() {
  const isCanada = siteConfig.market === "CA";

  return (
    <div className="container-page px-4 py-12 prose-tea">
      <h1 className="font-display text-4xl">Shipping</h1>
      {isCanada ? (
        <>
          <p className="mt-4 text-brand-muted">
            Orders of $50 or more ship free within Canada. Delivery estimates
            appear at checkout and typically arrive within a few business days
            after dispatch, depending on destination.
          </p>
          <p className="text-brand-muted">
            Remote destinations and any international options (when offered) are
            calculated at checkout.
          </p>
        </>
      ) : (
        <>
          <p className="mt-4 text-brand-muted">
            Orders of $50 or more ship free within the contiguous United States.
            Standard delivery typically arrives in 3–5 business days after
            dispatch.
          </p>
          <p className="text-brand-muted">
            Shipping rates for Alaska, Hawaii, and international destinations
            are calculated at checkout when available.
          </p>
        </>
      )}
    </div>
  );
}
