import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin Suppliers",
  description: "Supplier administration",
  path: "/admin/suppliers",
  noIndex: true,
});

export default async function AdminSuppliersPage() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="container-wide px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Suppliers</h1>
        <Link href="/admin" className="text-sm underline">
          Dashboard
        </Link>
      </div>
      <ul className="mt-8 space-y-3">
        {suppliers.map((s) => (
          <li key={s.id} className="rounded-md border border-[var(--brand-line)] bg-white p-4 text-sm">
            <p className="font-medium">{s.name}</p>
            <p className="text-brand-muted">
              {s.contactName} · {s.email} · lead time {s.leadTimeDays} days
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
