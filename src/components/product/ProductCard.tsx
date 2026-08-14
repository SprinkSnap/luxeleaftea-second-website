"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/product/Badge";
import { StockIndicator } from "@/components/product/StockIndicator";
import { useCart } from "@/components/providers/CartProvider";
import { ecommerce } from "@/lib/analytics";
import type { SerializedProductCard } from "@/lib/products";
import { formatMoney } from "@/lib/utils";

/** Badge priority for CRO: Best Seller → Limited → New → Staff Pick */
function productBadges(product: SerializedProductCard): string[] {
  const ordered = [
    product.isBestSeller ? "Best Seller" : null,
    product.isLimited ? "Limited Harvest" : null,
    product.isNew ? "New" : null,
    product.isStaffPick ? "Staff Pick" : null,
  ].filter(Boolean) as string[];
  return ordered.slice(0, 1);
}

export function ProductCard({
  product,
  listName = "catalog",
}: {
  product: SerializedProductCard;
  listName?: string;
}) {
  const { addItem } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const image = product.images[0] || "/images/products/dragon-well.svg";
  const badges = productBadges(product);
  const flavour =
    product.flavourNotes.slice(0, 3).join(" · ") || product.shortDescription;

  async function onAdd() {
    setLoading(true);
    setError(null);
    try {
      await addItem(product.variantId, 1);
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add to cart");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden rounded-[var(--radius-md)] bg-brand-mist"
        onClick={() =>
          ecommerce.selectItem({
            item_id: product.slug,
            item_name: product.name,
            item_list_name: listName,
            price: product.price / 100,
            currency: process.env.NEXT_PUBLIC_CURRENCY || "CAD",
          })
        }
      >
        <div className="relative aspect-[4/5]">
          <Image
            src={image}
            alt={`${product.name} — ${product.teaType} tea`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </div>
        {badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <Badge key={b} label={b} />
            ))}
          </div>
        )}
      </Link>

      <div className="mt-3.5 flex flex-1 flex-col sm:mt-4">
        <p className="text-[0.7rem] tracking-[0.14em] uppercase text-brand-muted">
          {product.teaType}
          {product.origin ? ` · ${product.origin}` : ""}
        </p>
        <h3 className="mt-1 font-display text-[1.2rem] leading-tight text-brand-forest-deep sm:text-xl">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-brand-muted">
          {flavour}
        </p>
        {product.rating && (
          <p
            className="mt-2 text-sm text-brand-ink"
            aria-label={`${product.rating.average} out of 5 from ${product.rating.count} reviews`}
          >
            ★ {product.rating.average.toFixed(1)}{" "}
            <span className="text-brand-muted">({product.rating.count})</span>
          </p>
        )}
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <p className="text-base font-medium text-brand-ink">
            {formatMoney(product.price)}
            <span className="ml-2 text-sm font-normal text-brand-muted">
              {product.packageSize}
            </span>
          </p>
          <StockIndicator
            available={product.stockAvailable}
            lowStock={product.lowStock}
          />
        </div>
        <div className="mt-auto space-y-2 pt-4">
          {product.stockAvailable > 0 ? (
            <button
              type="button"
              onClick={onAdd}
              disabled={loading}
              className="h-11 w-full rounded-[var(--radius-md)] bg-cta text-sm font-medium text-[var(--cta-text)] transition-colors hover:bg-cta-hover disabled:opacity-60"
              aria-live="polite"
            >
              {loading ? "Adding…" : added ? "Added to cart" : "Add to Cart"}
            </button>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--brand-line)] text-sm"
            >
              Notify Me When Available
            </Link>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="flex h-10 w-full items-center justify-center text-sm font-medium text-brand-forest underline-offset-2 hover:underline"
          >
            View details
          </Link>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
