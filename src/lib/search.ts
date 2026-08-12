import { prisma } from "@/lib/prisma";
import { serializeProductCard, productCardInclude } from "@/lib/products";

const synonyms: Record<string, string[]> = {
  green: ["green tea", "green"],
  "green tea": ["green"],
  oolong: ["oolong", "wu long", "wulong"],
  "wu long": ["oolong", "wulong"],
  wulong: ["oolong"],
  herbal: ["herbal", "tisane", "caffeine-free"],
  decaf: ["none", "low", "caffeine-free", "herbal"],
  "caffeine-free": ["none", "herbal"],
  puerh: ["pu-erh", "puerh", "pu er"],
  "pu-erh": ["puerh", "pu er"],
  matcha: ["matcha"],
};

export function expandQuery(q: string) {
  const normalized = q.trim().toLowerCase();
  const terms = new Set<string>([normalized, ...normalized.split(/\s+/)]);
  for (const [key, values] of Object.entries(synonyms)) {
    if (normalized.includes(key)) {
      values.forEach((v) => terms.add(v));
    }
  }
  return [...terms].filter(Boolean);
}

export async function searchAll(q: string, limit = 8) {
  if (!q.trim()) return { products: [], articles: [], collections: [] };

  const terms = expandQuery(q);
  const productOr = terms.flatMap((term) => [
    { name: { contains: term } },
    { teaType: { contains: term } },
    { origin: { contains: term } },
    { flavourNotes: { contains: term } },
    { ingredients: { contains: term } },
    { shortDescription: { contains: term } },
  ]);

  // Avoid falsely treating caffeinated tea as decaf
  const wantsDecaf =
    /\b(decaf|caffeine-free|no caffeine|caffeine free)\b/i.test(q);

  const products = await prisma.product.findMany({
    where: {
      published: true,
      OR: productOr,
      ...(wantsDecaf
        ? { caffeineLevel: { in: ["None", "Low"] } }
        : {}),
    },
    include: productCardInclude,
    take: limit,
  });

  const articles = await prisma.contentArticle.findMany({
    where: {
      published: true,
      OR: terms.flatMap((term) => [
        { title: { contains: term } },
        { excerpt: { contains: term } },
        { category: { contains: term } },
      ]),
    },
    take: 5,
  });

  const collections = await prisma.collection.findMany({
    where: {
      published: true,
      OR: terms.flatMap((term) => [
        { name: { contains: term } },
        { description: { contains: term } },
      ]),
    },
    take: 5,
  });

  return {
    products: products.map(serializeProductCard),
    articles,
    collections,
  };
}
