import { createMetadata } from "@/lib/seo";
import { freeShippingLabel, siteConfig } from "@/lib/site";
import { formatMoney } from "@/lib/utils";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Shipping",
  description:
    siteConfig.market === "CA"
      ? `Lux Leaf Tea shipping in Canada, including ${freeShippingLabel().toLowerCase()}. Prices in CAD.`
      : "Lux Leaf Tea shipping information and free-shipping threshold.",
  path: "/shipping",
});

export default function ShippingPage() {
  const isCanada = siteConfig.market === "CA";
  const threshold = formatMoney(siteConfig.freeShippingThreshold);
  const standard = formatMoney(siteConfig.standardShippingCents);

  return (
    <div className="container-page px-4 py-12 prose-tea">
      <h1 className="font-display text-4xl">Shipping</h1>
      {isCanada ? (
        <>
          <p className="mt-4 text-brand-muted">
            {freeShippingLabel()} within Canada. Below that threshold, standard
            shipping is {standard}. Prices are in {siteConfig.currency}.
          </p>
          <p className="text-brand-muted">
            Delivery timing depends on destination and appears once your address
            is entered at checkout. Tax is calculated at payment based on your
            province or territory — we do not show a flat guessed rate.
          </p>
          <p className="text-brand-muted">
            Questions?{" "}
            <Link href="/contact" className="underline underline-offset-2">
              Contact us
            </Link>
            .
          </p>
        </>
      ) : (
        <>
          <p className="mt-4 text-brand-muted">
            Orders of {threshold} or more may qualify for free shipping. Standard
            shipping is {standard} when applicable.
          </p>
          <p className="text-brand-muted">
            Shipping rates for special destinations are calculated at checkout
            when available.
          </p>
        </>
      )}
    </div>
  );
}
