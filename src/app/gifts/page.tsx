import { ProductGrid } from "@/components/product/ProductGrid";
import { prisma } from "@/lib/prisma";
import { productCardInclude, serializeProductCard } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { formatMoney } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export const metadata = createMetadata({
  title: "Tea Gift Sets — Premium Loose Leaf Gifts Canada",
  description:
    "Gift-worthy premium loose-leaf teas and discovery sets from Lux Leaf Tea. Elegant, approachable, ready to give. Prices in CAD.",
  path: "/gifts",
});

export default async function GiftsPage() {
  const collection = await prisma.collection.findUnique({
    where: { slug: "gifts" },
    include: {
      products: {
        include: { product: { include: productCardInclude } },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  const products =
    collection?.products.map((cp) => serializeProductCard(cp.product)) || [];
  const bundles = await prisma.bundle.findMany({ where: { active: true } });

  return (
    <div className="container-wide px-4 py-10 md:py-14">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl md:text-5xl">Gift Sets</h1>
        <p className="mt-3 text-brand-muted">
          Beautiful teas for someone you care about — or a refined discovery set
          for yourself. Add a gift message at checkout. Prices in{" "}
          {siteConfig.currency}.
        </p>
      </div>
      {bundles.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-white/80 p-6"
            >
              <h2 className="font-display text-2xl">{bundle.name}</h2>
              <p className="mt-2 text-sm text-brand-muted">{bundle.description}</p>
              <p className="mt-4 font-medium">{formatMoney(bundle.price)}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
