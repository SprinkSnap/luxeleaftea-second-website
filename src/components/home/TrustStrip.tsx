import { freeShippingLabel, siteConfig } from "@/lib/site";

const items = [
  { label: "Premium whole leaves" },
  { label: "Carefully selected origins" },
  { label: "Freshly packed" },
  { label: "Simple brewing guidance" },
  { label: freeShippingLabel() },
  { label: `Prices in ${siteConfig.currency}` },
];

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Why shop Lux Leaf Tea">
      <div className="container-wide px-4 py-4 md:py-5">
        <ul className="flex gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-4 md:overflow-visible lg:grid-cols-6 [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <li
              key={item.label}
              className="shrink-0 text-center text-[11px] tracking-[0.1em] uppercase text-[#f4f1e8]/90 md:text-xs"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
