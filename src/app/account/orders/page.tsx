import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Orders",
  description: "Your Lux Leaf Tea order history.",
  path: "/account/orders",
  noIndex: true,
});

export default function AccountOrdersPage() {
  return (
    <div className="container-page px-4 py-12">
      <h1 className="font-display text-4xl">Orders</h1>
      <p className="mt-3 text-brand-muted">
        Sign in to view order history, tracking, and Buy Again shortcuts. Guest
        checkout orders are available via the confirmation email link.
      </p>
    </div>
  );
}
