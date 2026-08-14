import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { prisma } from "@/lib/prisma";
import {
  productCardInclude,
  serializeProductCard,
} from "@/lib/products";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

const collectionGuides: Record<
  string,
  { href: string; label: string; blurb: string }
> = {
  "green-tea": {
    href: "/tea-guide/green-tea-brewing-temperature-guide",
    label: "Green tea brewing temperature guide",
    blurb:
      "Learn water temperatures and steep times that keep green tea sweet and clear.",
  },
  "black-tea": {
    href: "/tea-guide/black-tea-vs-green-tea",
    label: "Black tea vs green tea",
    blurb: "Understand body, caffeine, and when each style shines in the cup.",
  },
  oolong: {
    href: "/tea-guide/what-is-oolong-tea",
    label: "What is oolong tea?",
    blurb: "Explore the floral-to-roasted spectrum that makes oolong distinctive.",
  },
  "white-tea": {
    href: "/tea-guide/how-to-brew-loose-leaf-tea",
    label: "How to brew loose leaf tea",
    blurb: "Gentle brewing keeps delicate white teas soft and aromatic.",
  },
  herbal: {
    href: "/tea-guide/how-to-brew-loose-leaf-tea",
    label: "How to brew loose leaf tea",
    blurb: "Simple ratios and timing for caffeine-free herbal infusions.",
  },
  matcha: {
    href: "/tea-guide/beginners-guide-to-premium-tea",
    label: "Beginner’s guide to premium tea",
    blurb: "Start with ceremonial quality and a calm whisking ritual.",
  },
  "pu-erh": {
    href: "/tea-guide/how-to-brew-loose-leaf-tea",
    label: "How to brew loose leaf tea",
    blurb: "Multiple infusions bring out depth in ripe and aged pu-erh.",
  },
  "best-sellers": {
    href: "/tea-guide/beginners-guide-to-premium-tea",
    label: "Beginner’s guide to premium tea",
    blurb: "Not sure where to begin? Pair bestsellers with a short brewing primer.",
  },
  gifts: {
    href: "/tea-guide/best-tea-gifts",
    label: "Best tea gifts",
    blurb: "Thoughtful loose-leaf ideas for hosts, rituals, and celebrations.",
  },
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection) return {};
  const title =
    collection.seoTitle ||
    (collection.type === "tea-type"
      ? `Premium ${collection.name}`
      : collection.name);
  return createMetadata({
    title,
    description:
      collection.seoDescription ||
      collection.description ||
      `Shop ${collection.name} loose-leaf tea at Lux Leaf Tea.`,
    path: `/collections/${collection.slug}`,
  });
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = await prisma.collection.findFirst({
    where: { slug, published: true },
    include: {
      products: {
        orderBy: { sortOrder: "asc" },
        include: { product: { include: productCardInclude } },
      },
    },
  });
  if (!collection) notFound();

  const products = collection.products
    .filter((cp) => cp.product.published)
    .map((cp) => serializeProductCard(cp.product));

  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: collection.name, path: `/collections/${collection.slug}` },
  ]);

  const guide = collectionGuides[collection.slug];

  return (
    <div className="container-wide px-4 py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.16em] uppercase text-brand-muted">
          Collection
        </p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">
          {collection.name}
        </h1>
        {collection.description && (
          <p className="mt-3 text-brand-muted">{collection.description}</p>
        )}
      </div>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
      {guide && (
        <aside className="mt-14 max-w-2xl rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white/70 p-6">
          <h2 className="font-display text-2xl text-brand-forest-deep">
            Learn before you brew
          </h2>
          <p className="mt-2 text-sm text-brand-muted">{guide.blurb}</p>
          <Link
            href={guide.href}
            className="mt-4 inline-block text-sm font-medium text-brand-forest underline-offset-4 hover:underline"
          >
            {guide.label} →
          </Link>
        </aside>
      )}
    </div>
  );
}
