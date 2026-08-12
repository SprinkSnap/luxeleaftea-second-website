import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Returns",
  description: "Lux Leaf Tea returns and refunds policy.",
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <div className="container-page px-4 py-12 prose-tea">
      <h1 className="font-display text-4xl">Returns</h1>
      <p className="mt-4 text-brand-muted">
        Unopened products may be returned within 30 days of delivery. Contact
        hello@luxleaftea.com with your order number and we will guide the next
        step.
      </p>
    </div>
  );
}
