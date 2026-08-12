import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Tea Guide — Brewing, Origins & Gift Ideas",
  description:
    "Learn how to brew loose-leaf tea, understand tea types, and choose gifts with Lux Leaf Tea’s educational guide.",
  path: "/tea-guide",
});

export default async function TeaGuidePage() {
  const articles = await prisma.contentArticle.findMany({
    where: { published: true },
    orderBy: [{ category: "asc" }, { publishedAt: "desc" }],
  });
  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <div className="container-wide px-4 py-10 md:py-14">
      <h1 className="font-display text-4xl md:text-5xl">Tea Guide</h1>
      <p className="mt-3 max-w-2xl text-brand-muted">
        Approachable education for curious tea drinkers — linked to the teas in
        our boutique.
      </p>
      <div className="mt-10 space-y-10">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="font-display text-2xl text-brand-forest">{category}</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {articles
                .filter((a) => a.category === category)
                .map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/tea-guide/${article.slug}`}
                      className="block rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white/70 p-4 hover:border-brand-gold"
                    >
                      <h3 className="font-display text-xl">{article.title}</h3>
                      <p className="mt-1 text-sm text-brand-muted">
                        {article.excerpt}
                      </p>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
