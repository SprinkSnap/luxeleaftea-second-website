import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

const articleShopLinks: Record<
  string,
  { href: string; label: string }[]
> = {
  "how-to-brew-loose-leaf-tea": [
    { href: "/shop", label: "Shop all tea" },
    { href: "/collections/beginners", label: "Teas for beginners" },
  ],
  "black-tea-vs-green-tea": [
    { href: "/collections/green-tea", label: "Shop green tea" },
    { href: "/collections/black-tea", label: "Shop black tea" },
  ],
  "what-is-oolong-tea": [
    { href: "/collections/oolong", label: "Shop oolong tea" },
  ],
  "green-tea-brewing-temperature-guide": [
    { href: "/collections/green-tea", label: "Shop green tea" },
  ],
  "how-much-loose-leaf-tea-per-cup": [
    { href: "/shop", label: "Shop loose-leaf tea" },
  ],
  "beginners-guide-to-premium-tea": [
    { href: "/collections/beginners", label: "Shop beginner teas" },
    { href: "/find-your-tea", label: "Find your tea" },
  ],
  "best-tea-gifts": [
    { href: "/gifts", label: "Shop gifts" },
    { href: "/collections/gifts", label: "Gift sets" },
  ],
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.contentArticle.findUnique({ where: { slug } });
  if (!article) return {};
  return createMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    path: `/tea-guide/${article.slug}`,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.contentArticle.findFirst({
    where: { slug, published: true },
  });
  if (!article) notFound();

  const paragraphs = article.body.split("\n").filter(Boolean);
  const shopLinks = articleShopLinks[article.slug] || [
    { href: "/shop", label: "Shop Tea" },
    { href: "/find-your-tea", label: "Find My Tea" },
  ];

  return (
    <article className="container-page px-4 py-10 md:py-14">
      <p className="text-xs tracking-[0.16em] uppercase text-brand-muted">
        {article.category}
      </p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">{article.title}</h1>
      <p className="mt-3 text-lg text-brand-muted">{article.excerpt}</p>
      <div className="prose-tea mt-8">
        {paragraphs.map((line, i) => {
          if (line.startsWith("## ")) {
            return (
              <h2 key={i} className="font-display text-2xl text-brand-forest-deep">
                {line.replace(/^##\s+/, "")}
              </h2>
            );
          }
          const html = line.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" class="text-brand-forest underline underline-offset-2">$1</a>',
          );
          return (
            <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
          );
        })}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        {shopLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex h-11 items-center rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white px-5 text-sm font-medium text-brand-forest first:border-transparent first:bg-cta first:text-[var(--cta-text)]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </article>
  );
}
