import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin Orders",
  description: "Order administration",
  path: "/admin/orders",
  noIndex: true,
});

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="container-wide px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Orders</h1>
        <Link href="/admin" className="text-sm underline">
          Dashboard
        </Link>
      </div>
      <ul className="mt-8 space-y-2">
        {orders.map((order) => (
          <li
            key={order.id}
            className="rounded-md border border-[var(--brand-line)] bg-white px-4 py-3 text-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-brand-muted">{order.email}</p>
              </div>
              <div className="text-right">
                <p>{formatMoney(order.total)}</p>
                <p className="text-xs text-brand-muted">{order.status}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
