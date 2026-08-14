import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { BrewingGuide } from "@/components/product/BrewingGuide";
import { TeaProfile } from "@/components/product/TeaProfile";
import { Badge } from "@/components/product/Badge";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  breadcrumbJsonLd,
  createMetadata,
  productJsonLd,
} from "@/lib/seo";
import {
  getProductBySlug,
  getReviewSummary,
  productCardInclude,
  serializeProductCard,
} from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { parseJsonArray, stockAvailable } from "@/lib/utils";
import { collectionSlugForTeaType, siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

const guideByTeaType: Record<string, { href: string; label: string }> = {
  "Green Tea": {
    href: "/tea-guide/green-tea-brewing-temperature-guide",
    label: "Green tea brewing guide",
  },
  Green: {
    href: "/tea-guide/green-tea-brewing-temperature-guide",
    label: "Green tea brewing guide",
  },
  "Black Tea": {
    href: "/tea-guide/black-tea-vs-green-tea",
    label: "Black tea vs green tea",
  },
  Black: {
    href: "/tea-guide/black-tea-vs-green-tea",
    label: "Black tea vs green tea",
  },
  Oolong: {
    href: "/tea-guide/what-is-oolong-tea",
    label: "What is oolong tea?",
  },
  "White Tea": {
    href: "/tea-guide/how-to-brew-loose-leaf-tea",
    label: "How to brew loose leaf tea",
  },
  White: {
    href: "/tea-guide/how-to-brew-loose-leaf-tea",
    label: "How to brew loose leaf tea",
  },
  Herbal: {
    href: "/tea-guide/how-to-brew-loose-leaf-tea",
    label: "How to brew loose leaf tea",
  },
  "Pu-erh": {
    href: "/tea-guide/how-to-brew-loose-leaf-tea",
    label: "How to brew loose leaf tea",
  },
  Matcha: {
    href: "/tea-guide/beginners-guide-to-premium-tea",
    label: "Beginner’s guide to premium tea",
  },
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return createMetadata({
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    path: `/products/${product.slug}`,
    image: parseJsonArray(product.images)[0],
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = parseJsonArray(product.images);
  const flavourNotes = parseJsonArray(product.flavourNotes);
  const variant =
    product.variants.find((v) => v.isDefault) || product.variants[0];
  if (!variant) notFound();

  const available = variant.inventory
    ? stockAvailable(
        variant.inventory.stockOnHand,
        variant.inventory.stockReserved,
      )
    : 0;
  const lowStock = variant.inventory
    ? available > 0 && available <= variant.inventory.reorderPoint
    : false;

  const sizes = product.variants.map((v) => ({
    id: v.id,
    label: v.packageSize,
    price: v.retailPrice,
    stock: v.inventory
      ? stockAvailable(v.inventory.stockOnHand, v.inventory.stockReserved)
      : 0,
  }));

  const reviewSummary = getReviewSummary(product);
  const approvedReviews = product.reviews;

  const relatedRaw = await prisma.product.findMany({
    where: {
      published: true,
      teaType: product.teaType,
      NOT: { id: product.id },
    },
    include: productCardInclude,
    take: 4,
    orderBy: [{ isBestSeller: "desc" }, { updatedAt: "desc" }],
  });
  const related = relatedRaw.map(serializeProductCard);

  const jsonLd = productJsonLd({
    name: product.name,
    description: product.shortDescription,
    slug: product.slug,
    images,
    sku: variant.sku,
    price: variant.retailPrice,
    availability: available > 0 ? "InStock" : "OutOfStock",
    offers: product.variants.map((v) => {
      const stock = v.inventory
        ? stockAvailable(v.inventory.stockOnHand, v.inventory.stockReserved)
        : 0;
      return {
        sku: v.sku,
        url: `/products/${product.slug}`,
        price: v.retailPrice,
        availability: (stock > 0 ? "InStock" : "OutOfStock") as
          | "InStock"
          | "OutOfStock",
        packageSize: v.packageSize,
      };
    }),
    aggregateRating: reviewSummary
      ? {
          ratingValue: reviewSummary.average,
          reviewCount: reviewSummary.count,
        }
      : null,
    reviews: approvedReviews.slice(0, 10).map((r) => ({
      authorName: r.authorName,
      rating: r.rating,
      body: r.body,
      datePublished: r.createdAt?.toISOString?.() ?? undefined,
    })),
  });

  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: product.name, path: `/products/${product.slug}` },
  ]);

  const guide = guideByTeaType[product.teaType];
  const badges = [
    product.isBestSeller ? "Best Seller" : null,
    product.isLimited ? "Limited Harvest" : null,
    product.isNew ? "New" : null,
    product.isStaffPick ? "Staff Pick" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="container-wide px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, crumbs]) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-brand-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop">Shop</Link>
          </li>
          <li>/</li>
          <li className="text-brand-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-brand-mist">
          <Image
            src={images[0] || "/images/products/dragon-well.svg"}
            alt={`${product.name} loose-leaf tea`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="lg:sticky lg:top-36 lg:self-start">
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.slice(0, 2).map((label) => (
                <Badge key={label} label={label} />
              ))}
            </div>
          )}
          <p className="mt-4 text-xs tracking-[0.16em] uppercase text-brand-muted">
            {product.teaType}
            {product.origin ? ` · ${product.origin}` : ""}
          </p>
          <h1 className="mt-2 font-display text-4xl text-brand-forest-deep md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-brand-muted">
            {product.shortDescription}
          </p>
          {reviewSummary && (
            <p className="mt-3 text-sm text-brand-ink">
              ★ {reviewSummary.average.toFixed(1)}{" "}
              <span className="text-brand-muted">
                ({reviewSummary.count} review
                {reviewSummary.count === 1 ? "" : "s"})
              </span>
            </p>
          )}
          <div className="mt-8">
            <AddToCartPanel
              variantId={variant.id}
              price={variant.retailPrice}
              packageSize={variant.packageSize}
              stockAvailable={available}
              lowStock={lowStock}
              sizes={sizes}
              cupsEstimate={product.cupsEstimate}
            />
          </div>
          <p className="mt-4 text-sm text-brand-muted">
            Not sure this is the right tea?{" "}
            <Link
              href="/find-your-tea"
              className="font-medium text-brand-forest underline-offset-2 hover:underline"
            >
              Find Your Tea
            </Link>{" "}
            or{" "}
            <Link
              href="/contact"
              className="font-medium text-brand-forest underline-offset-2 hover:underline"
            >
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl md:text-3xl">What it tastes like</h2>
        <div className="mt-6">
          <TeaProfile
            aroma={product.aromaScore}
            body={product.bodyScore}
            sweetness={product.sweetnessScore}
            roast={product.roastScore}
            caffeine={product.caffeineScore}
            flavourNotes={flavourNotes}
          />
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl md:text-3xl">
            Why you’ll like it
          </h2>
          <div className="prose-tea mt-4">
            <p>{product.description}</p>
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl md:text-3xl">
            Origin &amp; harvest
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Origin", product.origin],
              ["Region", product.region],
              ["Harvest", product.harvest],
              ["Cultivar", product.cultivar],
              ["Processing", product.processingMethod],
              ["Leaf appearance", product.leafAppearance],
            ].map(([label, value]) =>
              value ? (
                <div
                  key={String(label)}
                  className="grid grid-cols-[9rem_1fr] gap-3 border-b border-[var(--brand-line)] pb-2"
                >
                  <dt className="text-brand-muted">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ) : null,
            )}
          </dl>
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl md:text-3xl">How to brew</h2>
          <div className="mt-6">
            <BrewingGuide
              amount={product.brewingAmount}
              tempC={product.waterTempC}
              steepSeconds={product.steepTimeSeconds}
              infusions={product.infusions}
            />
          </div>
          {guide && (
            <p className="mt-4 text-sm text-brand-muted">
              Want more detail?{" "}
              <Link
                href={guide.href}
                className="font-medium text-brand-forest underline-offset-2 hover:underline"
              >
                {guide.label}
              </Link>
            </p>
          )}
        </div>
        <div>
          <h2 className="font-display text-2xl md:text-3xl">
            Ingredients &amp; caffeine
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Ingredients", product.ingredients],
              ["Caffeine", product.caffeineLevel],
              ["Strength", product.strength],
              ["Best time", product.timeOfDay],
              [
                "Estimated cups",
                product.cupsEstimate ? `~${product.cupsEstimate}` : null,
              ],
              ["Storage", product.storageInstructions],
            ].map(([label, value]) =>
              value ? (
                <div
                  key={String(label)}
                  className="grid grid-cols-[9rem_1fr] gap-3 border-b border-[var(--brand-line)] pb-2"
                >
                  <dt className="text-brand-muted">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ) : null,
            )}
          </dl>
        </div>
      </section>

      {approvedReviews.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl md:text-3xl">
            Customer reviews
          </h2>
          <ul className="mt-6 space-y-4">
            {approvedReviews.map((review) => (
              <li
                key={review.id}
                className="rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white/70 p-4"
              >
                <p className="text-sm">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                  {review.verifiedPurchase && (
                    <span className="ml-2 text-brand-muted">
                      Verified purchase
                    </span>
                  )}
                </p>
                <p className="mt-2 font-medium">{review.authorName}</p>
                <p className="mt-1 text-brand-muted">{review.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl md:text-3xl">
              You may also like
            </h2>
            <Link
              href={`/collections/${collectionSlugForTeaType(product.teaType)}`}
              className="text-sm font-medium text-brand-forest underline-offset-4 hover:underline"
            >
              More {product.teaType}
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}

      <section className="mt-16 rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-brand-mist/50 p-5 md:p-6">
        <h2 className="font-display text-2xl">Shipping &amp; returns</h2>
        <p className="mt-2 text-sm text-brand-muted">
          Prices in {siteConfig.currency}. Guest checkout welcome. See our{" "}
          <Link href="/shipping" className="underline underline-offset-2">
            shipping
          </Link>{" "}
          and{" "}
          <Link href="/returns" className="underline underline-offset-2">
            returns
          </Link>{" "}
          pages for details.
        </p>
        <p className="mt-3 text-sm text-brand-muted">
          Questions about this tea?{" "}
          <Link
            href="/contact"
            className="font-medium text-brand-forest underline-offset-2 hover:underline"
          >
            Contact us
          </Link>
          {" · "}
          <Link
            href="/find-your-tea"
            className="font-medium text-brand-forest underline-offset-2 hover:underline"
          >
            Find Your Tea
          </Link>
        </p>
      </section>
      <div className="h-20 md:hidden" aria-hidden />
    </div>
  );
}
