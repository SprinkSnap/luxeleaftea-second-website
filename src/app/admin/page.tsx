import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { stockAvailable, formatMoney } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin Dashboard",
  description: "Lux Leaf Tea store administration.",
  path: "/admin",
  noIndex: true,
});

export default async function AdminDashboardPage() {
  const [variants, alerts, orders, products] = await Promise.all([
    prisma.productVariant.findMany({
      include: { inventory: true, product: true },
    }),
    prisma.stockAlert.findMany({ where: { status: "OPEN" } }),
    prisma.order.findMany({
      where: { status: "PAID" },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.product.count({ where: { published: true } }),
  ]);

  const inventories = variants.map((v) => v.inventory).filter(Boolean);
  const lowStock = inventories.filter(
    (inv) =>
      inv &&
      stockAvailable(inv.stockOnHand, inv.stockReserved) <= inv.reorderPoint &&
      stockAvailable(inv.stockOnHand, inv.stockReserved) > 0,
  );
  const outOfStock = inventories.filter(
    (inv) => inv && stockAvailable(inv.stockOnHand, inv.stockReserved) <= 0,
  );
  const inventoryValue = variants.reduce((sum, v) => {
    const onHand = v.inventory?.stockOnHand || 0;
    return sum + onHand * (v.unitCost || 0);
  }, 0);
  const incoming = inventories.reduce((sum, inv) => sum + (inv?.incomingStock || 0), 0);
  const unitsSold = orders.reduce(
    (sum, order) => sum + order.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );

  const cards = [
    { label: "Total SKUs", value: String(variants.length) },
    { label: "Published products", value: String(products) },
    { label: "Inventory value", value: formatMoney(inventoryValue) },
    { label: "Low stock", value: String(lowStock.length) },
    { label: "Out of stock", value: String(outOfStock.length) },
    { label: "Incoming units", value: String(incoming) },
    { label: "Open reorder alerts", value: String(alerts.length) },
    { label: "Recent paid units", value: String(unitsSold) },
  ];

  const links = [
    { href: "/admin/products", label: "Products" },
    { href: "/admin/inventory", label: "Inventory" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/suppliers", label: "Suppliers" },
    { href: "/admin/purchase-orders", label: "Purchase Orders" },
    { href: "/admin/content", label: "Content" },
  ];

  return (
    <div className="container-wide px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.16em] uppercase text-brand-muted">
            Operations
          </p>
          <h1 className="mt-2 font-display text-4xl">Admin Dashboard</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-[var(--brand-line)] bg-white px-3 py-1.5 text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white/80 p-4"
          >
            <p className="text-xs tracking-[0.12em] uppercase text-brand-muted">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl text-brand-forest">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl">Reorder alerts</h2>
          <ul className="mt-4 space-y-2">
            {alerts.length === 0 && (
              <li className="text-sm text-brand-muted">No open alerts.</li>
            )}
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="rounded-md border border-[var(--brand-line)] bg-white p-3 text-sm"
              >
                <p className="font-medium">
                  {alert.productName} · {alert.sku}
                </p>
                <p className="text-brand-muted">
                  Available {alert.stockAvailable} / reorder at {alert.reorderPoint} ·
                  suggest {alert.suggestedReorderQty}
                </p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl">Recent paid orders</h2>
          <ul className="mt-4 space-y-2">
            {orders.length === 0 && (
              <li className="text-sm text-brand-muted">No paid orders yet.</li>
            )}
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-md border border-[var(--brand-line)] bg-white p-3 text-sm"
              >
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-brand-muted">
                  {order.email} · {formatMoney(order.total)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="mt-8 text-xs text-brand-muted">
        Protect /admin with authentication before production launch. Seeded admin:
        admin@luxleaftea.com (change password immediately).
      </p>
    </div>
  );
}
