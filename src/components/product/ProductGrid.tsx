import { ProductCard } from "@/components/product/ProductCard";
import type { SerializedProductCard } from "@/lib/products";

export function ProductGrid({ products }: { products: SerializedProductCard[] }) {
  if (!products.length) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--brand-line)] px-6 py-16 text-center">
        <p className="font-display text-2xl text-brand-forest">No teas match</p>
        <p className="mt-2 text-brand-muted">
          Try clearing filters or explore Best Sellers.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
