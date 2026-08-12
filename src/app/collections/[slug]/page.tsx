import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { prisma } from "@/lib/prisma";
import {
  productCardInclude,
  serializeProductCard,
} from "@/lib/products";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection) return {};
  return createMetadata({
    title: collection.seoTitle || collection.name,
    description:
      collection.seoDescription ||
      collection.description ||
      `Shop ${collection.name} at Lux Leaf Tea.`,
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
    { name: "Collections", path: "/shop" },
    { name: collection.name, path: `/collections/${collection.slug}` },
  ]);

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
    </div>
  );
}
