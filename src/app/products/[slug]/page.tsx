import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { BrewingGuide } from "@/components/product/BrewingGuide";
import { TeaProfile } from "@/components/product/TeaProfile";
import { Badge } from "@/components/product/Badge";
import {
  breadcrumbJsonLd,
  createMetadata,
  productJsonLd,
} from "@/lib/seo";
import { getProductBySlug } from "@/lib/products";
import { parseJsonArray, stockAvailable } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

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
  const variant = product.variants.find((v) => v.isDefault) || product.variants[0];
  if (!variant) notFound();

  const available = variant.inventory
    ? stockAvailable(variant.inventory.stockOnHand, variant.inventory.stockReserved)
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

  const jsonLd = productJsonLd({
    name: product.name,
    description: product.shortDescription,
    slug: product.slug,
    images,
    sku: variant.sku,
    price: variant.retailPrice,
    availability: available > 0 ? "InStock" : "OutOfStock",
  });

  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: product.name, path: `/products/${product.slug}` },
  ]);

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
          <div className="flex flex-wrap gap-2">
            {product.isBestSeller && <Badge label="Best Seller" />}
            {product.isStaffPick && <Badge label="Staff Pick" />}
            {product.isNew && <Badge label="New" />}
            {product.isLimited && <Badge label="Limited Harvest" />}
          </div>
          <p className="mt-4 text-xs tracking-[0.16em] uppercase text-brand-muted">
            {product.teaType} · {product.origin}
          </p>
          <h1 className="mt-2 font-display text-4xl text-brand-forest-deep md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-brand-muted">{product.shortDescription}</p>
          <div className="mt-8">
            <AddToCartPanel
              variantId={variant.id}
              price={variant.retailPrice}
              packageSize={variant.packageSize}
              stockAvailable={available}
              lowStock={lowStock}
              sizes={sizes}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <TeaProfile
          aroma={product.aromaScore}
          body={product.bodyScore}
          sweetness={product.sweetnessScore}
          roast={product.roastScore}
          caffeine={product.caffeineScore}
          flavourNotes={flavourNotes}
        />
        <BrewingGuide
          amount={product.brewingAmount}
          tempC={product.waterTempC}
          steepSeconds={product.steepTimeSeconds}
          infusions={product.infusions}
        />
      </div>

      <section className="mt-16 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl">Tea Information</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Tea type", product.teaType],
              ["Origin", product.origin],
              ["Region", product.region],
              ["Harvest", product.harvest],
              ["Cultivar", product.cultivar],
              ["Processing", product.processingMethod],
              ["Ingredients", product.ingredients],
              ["Caffeine", product.caffeineLevel],
              ["Leaf appearance", product.leafAppearance],
              ["Time of day", product.timeOfDay],
              ["Package", variant.packageSize],
              ["Estimated cups", product.cupsEstimate ? `~${product.cupsEstimate}` : null],
              ["Storage", product.storageInstructions],
            ].map(([label, value]) =>
              value ? (
                <div key={String(label)} className="grid grid-cols-[9rem_1fr] gap-3 border-b border-[var(--brand-line)] pb-2">
                  <dt className="text-brand-muted">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ) : null,
            )}
          </dl>
        </div>
        <div>
          <h2 className="font-display text-2xl">About this tea</h2>
          <div className="prose-tea mt-4">
            <p>{product.description}</p>
          </div>
          <div className="mt-8 rounded-[var(--radius-md)] bg-brand-mist/80 p-5 text-sm text-brand-muted">
            <p className="font-medium text-brand-forest">Why it’s worth it</p>
            <p className="mt-2">
              Whole-leaf quality, transparent origin details, and brewing guidance
              designed for an elevated cup without requiring expertise.
            </p>
          </div>
        </div>
      </section>

      {product.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl">Customer Reviews</h2>
          <ul className="mt-6 space-y-4">
            {product.reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white/70 p-4"
              >
                <p className="text-sm">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                  {review.verifiedPurchase && (
                    <span className="ml-2 text-brand-muted">Verified purchase</span>
                  )}
                </p>
                <p className="mt-2 font-medium">{review.authorName}</p>
                <p className="mt-1 text-brand-muted">{review.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="h-20 md:hidden" aria-hidden />
    </div>
  );
}
