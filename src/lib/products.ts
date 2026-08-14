import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseJsonArray, stockAvailable } from "@/lib/utils";

export const productCardInclude = {
  variants: {
    where: { active: true },
    include: { inventory: true },
    orderBy: { retailPrice: "asc" as const },
  },
  reviews: {
    where: { status: "APPROVED" as const },
    select: { rating: true },
  },
} satisfies Prisma.ProductInclude;

export type ProductCardData = Prisma.ProductGetPayload<{
  include: typeof productCardInclude;
}>;

export function getDefaultVariant(product: ProductCardData) {
  return product.variants.find((v) => v.isDefault) || product.variants[0] || null;
}

export function getReviewSummary(product: {
  reviews: { rating: number }[];
}) {
  if (!product.reviews.length) return null;
  const count = product.reviews.length;
  const average =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) / count;
  return { average, count };
}

export function serializeProductCard(product: ProductCardData) {
  const variant = getDefaultVariant(product);
  const inventory = variant?.inventory;
  const available = inventory
    ? stockAvailable(inventory.stockOnHand, inventory.stockReserved)
    : 0;
  const review = getReviewSummary(product);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    teaType: product.teaType,
    shortDescription: product.shortDescription,
    flavourNotes: parseJsonArray(product.flavourNotes),
    images: parseJsonArray(product.images),
    origin: product.origin,
    caffeineLevel: product.caffeineLevel,
    strength: product.strength,
    isBestSeller: product.isBestSeller,
    isStaffPick: product.isStaffPick,
    isNew: product.isNew,
    isLimited: product.isLimited,
    isOrganic: product.isOrganic,
    price: variant?.retailPrice ?? 0,
    packageSize: variant?.packageSize ?? "",
    variantId: variant?.id ?? "",
    sku: variant?.sku ?? "",
    stockAvailable: available,
    inventoryStatus: inventory?.inventoryStatus ?? "OUT_OF_STOCK",
    lowStock: inventory ? available > 0 && available <= inventory.reorderPoint : false,
    rating: review,
  };
}

export type SerializedProductCard = ReturnType<typeof serializeProductCard>;

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: { published: true, OR: [{ isBestSeller: true }, { isFeatured: true }] },
    include: productCardInclude,
    take: limit,
    orderBy: [{ isBestSeller: "desc" }, { updatedAt: "desc" }],
  });
  return products.map(serializeProductCard);
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, published: true },
    include: {
      ...productCardInclude,
      collections: { include: { collection: true } },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export type ShopFilters = {
  teaType?: string;
  flavour?: string;
  caffeine?: string;
  origin?: string;
  strength?: string;
  availability?: string;
  organic?: string;
  bestSeller?: string;
  q?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
};

export async function queryProducts(filters: ShopFilters = {}) {
  const where: Prisma.ProductWhereInput = { published: true };

  if (filters.teaType) where.teaType = filters.teaType;
  if (filters.caffeine) where.caffeineLevel = filters.caffeine;
  if (filters.origin) where.origin = filters.origin;
  if (filters.strength) where.strength = filters.strength;
  if (filters.organic === "1") where.isOrganic = true;
  if (filters.bestSeller === "1") where.isBestSeller = true;
  if (filters.flavour) {
    where.flavourNotes = { contains: filters.flavour };
  }
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q } },
      { teaType: { contains: filters.q } },
      { origin: { contains: filters.q } },
      { flavourNotes: { contains: filters.q } },
      { shortDescription: { contains: filters.q } },
      { ingredients: { contains: filters.q } },
    ];
  }

  let products = await prisma.product.findMany({
    where,
    include: productCardInclude,
  });

  let serialized = products.map(serializeProductCard);

  if (filters.availability === "in-stock") {
    serialized = serialized.filter((p) => p.stockAvailable > 0);
  }
  if (filters.minPrice != null) {
    serialized = serialized.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    serialized = serialized.filter((p) => p.price <= filters.maxPrice!);
  }

  switch (filters.sort) {
    case "price-asc":
      serialized.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      serialized.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      products = products.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
      serialized = products.map(serializeProductCard);
      break;
    case "best-selling":
      serialized.sort(
        (a, b) => Number(b.isBestSeller) - Number(a.isBestSeller),
      );
      break;
    default:
      serialized.sort(
        (a, b) =>
          Number(b.isBestSeller) - Number(a.isBestSeller) ||
          Number(b.isStaffPick) - Number(a.isStaffPick),
      );
  }

  return serialized;
}
