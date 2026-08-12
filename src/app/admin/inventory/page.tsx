import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney, stockAvailable } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin Inventory",
  description: "Inventory management",
  path: "/admin/inventory",
  noIndex: true,
});

export default async function AdminInventoryPage() {
  const variants = await prisma.productVariant.findMany({
    include: {
      product: true,
      inventory: { include: { supplier: true } },
    },
    orderBy: { sku: "asc" },
  });

  return (
    <div className="container-wide px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Inventory</h1>
        <Link href="/admin" className="text-sm text-brand-forest underline">
          Dashboard
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-brand-mist/80 text-xs uppercase tracking-[0.08em] text-brand-muted">
            <tr>
              <th className="px-3 py-3">SKU</th>
              <th className="px-3 py-3">Product</th>
              <th className="px-3 py-3">On hand</th>
              <th className="px-3 py-3">Reserved</th>
              <th className="px-3 py-3">Available</th>
              <th className="px-3 py-3">Reorder</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Supplier</th>
              <th className="px-3 py-3">Unit cost</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => {
              const inv = v.inventory;
              const available = inv
                ? stockAvailable(inv.stockOnHand, inv.stockReserved)
                : 0;
              return (
                <tr key={v.id} className="border-t border-[var(--brand-line)]">
                  <td className="px-3 py-3 font-medium">{v.sku}</td>
                  <td className="px-3 py-3">
                    {v.product.name}
                    <span className="block text-xs text-brand-muted">
                      {v.packageSize}
                    </span>
                  </td>
                  <td className="px-3 py-3">{inv?.stockOnHand ?? 0}</td>
                  <td className="px-3 py-3">{inv?.stockReserved ?? 0}</td>
                  <td className="px-3 py-3">{available}</td>
                  <td className="px-3 py-3">{inv?.reorderPoint ?? "—"}</td>
                  <td className="px-3 py-3">{inv?.inventoryStatus ?? "—"}</td>
                  <td className="px-3 py-3">{inv?.supplier?.name ?? "—"}</td>
                  <td className="px-3 py-3">
                    {v.unitCost != null ? formatMoney(v.unitCost) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
