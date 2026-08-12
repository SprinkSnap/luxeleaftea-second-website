import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";
import { formatMoney } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Order Confirmation",
  description: "Your Lux Leaf Tea order details.",
  path: "/order",
  noIndex: true,
});

type Props = { params: Promise<{ id: string }> };

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="container-page px-4 py-12 md:py-16">
      <p className="text-xs tracking-[0.16em] uppercase text-brand-muted">
        Order confirmed
      </p>
      <h1 className="mt-2 font-display text-4xl text-brand-forest-deep">
        Thank you for your order
      </h1>
      <p className="mt-3 text-brand-muted">
        Order <span className="font-medium text-brand-ink">{order.orderNumber}</span>
        {" · "}
        {order.estimatedDelivery || "Delivery estimate coming soon"}
      </p>

      <ul className="mt-8 space-y-3 rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-white/80 p-5">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3 text-sm">
            <span>
              {item.productName} · {item.variantName} × {item.quantity}
            </span>
            <span>{formatMoney(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Total paid</dt>
          <dd className="font-medium">{formatMoney(order.total)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Email</dt>
          <dd>{order.email}</dd>
        </div>
      </dl>

      <div className="mt-8 rounded-[var(--radius-md)] bg-brand-mist p-5">
        <h2 className="font-display text-2xl">Brewing tip</h2>
        <p className="mt-2 text-sm text-brand-muted">
          Each product page includes amount, temperature, and steep time. Start
          there, taste, and adjust gently.
        </p>
        <Link href="/tea-guide/how-to-brew-loose-leaf-tea" className="mt-3 inline-block text-sm text-brand-forest underline">
          How to brew loose-leaf tea
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/shop"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] bg-cta px-5 text-sm font-medium text-[var(--cta-text)]"
        >
          Buy Again
        </Link>
        <Link
          href="/account"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] border border-[var(--brand-line)] px-5 text-sm"
        >
          Create account (optional)
        </Link>
      </div>
    </div>
  );
}
