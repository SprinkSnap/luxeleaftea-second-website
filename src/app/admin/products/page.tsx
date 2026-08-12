import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin Products",
  description: "Product administration",
  path: "/admin/products",
  noIndex: true,
});

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container-wide px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Products</h1>
        <Link href="/admin" className="text-sm underline">
          Dashboard
        </Link>
      </div>
      <ul className="mt-8 divide-y divide-[var(--brand-line)] rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-white">
        {products.map((product) => {
          const variant = product.variants[0];
          return (
            <li key={product.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-brand-muted">
                  {product.teaType} · /products/{product.slug}
                </p>
              </div>
              <div className="text-right">
                <p>{variant ? formatMoney(variant.retailPrice) : "—"}</p>
                <p className="text-xs text-brand-muted">
                  {product.published ? "Published" : "Draft"}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
