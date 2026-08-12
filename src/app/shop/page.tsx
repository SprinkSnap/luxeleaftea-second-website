import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { queryProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Shop Premium Loose-Leaf Tea",
  description:
    "Browse Lux Leaf Tea’s collection of premium loose-leaf teas by type, flavour, caffeine, and occasion.",
  path: "/shop",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const products = await queryProducts({
    teaType: typeof sp.teaType === "string" ? sp.teaType : undefined,
    caffeine: typeof sp.caffeine === "string" ? sp.caffeine : undefined,
    origin: typeof sp.origin === "string" ? sp.origin : undefined,
    strength: typeof sp.strength === "string" ? sp.strength : undefined,
    availability:
      typeof sp.availability === "string" ? sp.availability : undefined,
    organic: typeof sp.organic === "string" ? sp.organic : undefined,
    bestSeller: typeof sp.bestSeller === "string" ? sp.bestSeller : undefined,
    sort: typeof sp.sort === "string" ? sp.sort : undefined,
    q: typeof sp.q === "string" ? sp.q : undefined,
  });

  return (
    <div className="container-wide px-4 py-10 md:py-14">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl md:text-5xl">Shop Tea</h1>
        <p className="mt-3 text-brand-muted">
          Premium loose-leaf teas with clear sensory notes, brewing guidance,
          and honest inventory status.
        </p>
      </div>
      <div className="mt-8">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-brand-mist" />}>
          <ShopFilters />
        </Suspense>
      </div>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
