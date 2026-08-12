import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";
import { CreatePOButton } from "@/components/admin/CreatePOButton";

export const metadata = createMetadata({
  title: "Admin Purchase Orders",
  description: "Purchase order tracking",
  path: "/admin/purchase-orders",
  noIndex: true,
});

export default async function AdminPurchaseOrdersPage() {
  const [orders, alerts, suppliers] = await Promise.all([
    prisma.purchaseOrder.findMany({
      include: { supplier: true, items: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.stockAlert.findMany({
      where: { status: "OPEN" },
      include: { variant: true },
    }),
    prisma.supplier.findMany({ where: { active: true } }),
  ]);

  return (
    <div className="container-wide px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Purchase Orders</h1>
        <div className="flex items-center gap-3">
          <CreatePOButton
            alerts={alerts.map((a) => ({
              id: a.id,
              variantId: a.variantId,
              sku: a.sku,
              qty: a.suggestedReorderQty,
              productName: a.productName,
            }))}
            supplierId={suppliers[0]?.id || ""}
          />
          <Link href="/admin" className="text-sm underline">
            Dashboard
          </Link>
        </div>
      </div>
      <ul className="mt-8 space-y-3">
        {orders.length === 0 && (
          <li className="text-sm text-brand-muted">
            No purchase orders yet. Create one from open reorder alerts.
          </li>
        )}
        {orders.map((po) => (
          <li key={po.id} className="rounded-md border border-[var(--brand-line)] bg-white p-4 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <p className="font-medium">{po.poNumber}</p>
                <p className="text-brand-muted">
                  {po.supplier.name} · {po.items.length} line(s) · {po.status}
                </p>
              </div>
              <p>{formatMoney(po.totalCost)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
