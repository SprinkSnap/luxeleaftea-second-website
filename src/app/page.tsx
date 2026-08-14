import Link from "next/link";
import { existsSync } from "fs";
import path from "path";
import { HeroVisual } from "@/components/home/HeroVisual";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ProductGrid } from "@/components/product/ProductGrid";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { ButtonLink } from "@/components/ui/Button";
import { getFeaturedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { mobileQuickNav, siteConfig } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { TrackOnce } from "@/components/analytics/TrackOnce";

const homepageTitle =
  siteConfig.market === "CA"
    ? "Premium Loose Leaf Tea in Canada"
    : "Premium Loose Leaf Tea";

export const metadata = createMetadata({
  title: homepageTitle,
  description: siteConfig.description,
  path: "/",
});

const teaTypes = [
  { slug: "green-tea", name: "Green", blurb: "Fresh, refined, and clear." },
  { slug: "black-tea", name: "Black", blurb: "Full-bodied morning cups." },
  { slug: "oolong", name: "Oolong", blurb: "Floral to roasted layers." },
  { slug: "white-tea", name: "White", blurb: "Delicate and soft." },
  { slug: "herbal", name: "Herbal", blurb: "Caffeine-free comfort." },
  { slug: "pu-erh", name: "Pu-erh", blurb: "Deep and smooth." },
  { slug: "matcha", name: "Matcha", blurb: "Vibrant and focused." },
];

const values = [
  {
    title: "Premium whole leaves",
    copy: "Selected for aroma, clarity, and lasting character in the cup.",
  },
  {
    title: "Carefully selected origins",
    copy: "Traceable regions and harvests you can understand at a glance.",
  },
  {
    title: "Freshly packed",
    copy: "Packed to protect flavour from leaf to your first infusion.",
  },
  {
    title: "Simple brewing guidance",
    copy: "Clear instructions on every tea — no expertise required.",
  },
];

function heroAssetAvailable() {
  try {
    return existsSync(
      path.join(process.cwd(), "public", siteConfig.heroImage.replace(/^\//, "")),
    );
  } catch {
    return false;
  }
}

export default async function HomePage() {
  const [products, articles] = await Promise.all([
    getFeaturedProducts(4),
    prisma.contentArticle.findMany({
      where: {
        published: true,
        slug: {
          in: [
            "how-to-brew-loose-leaf-tea",
            "black-tea-vs-green-tea",
            "how-much-loose-leaf-tea-per-cup",
            "beginners-guide-to-premium-tea",
            "what-is-oolong-tea",
          ],
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  const hasHeroPhoto = heroAssetAvailable();

  return (
    <>
      <TrackOnce
        event="view_item_list"
        payload={{ item_list_name: "homepage_best_sellers", items: products }}
      />

      {/* Section 1 — Editorial hero */}
      <section className="relative overflow-hidden bg-brand-cream">
        <div className="container-wide grid items-center gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:py-14 lg:min-h-[min(72svh,40rem)] lg:gap-14 lg:py-16">
          <div className="max-w-xl animate-fade-up">
            <p className="text-[11px] tracking-[0.22em] uppercase text-brand-muted">
              Premium Loose-Leaf Tea
            </p>
            <h1 className="mt-3 font-display text-[2.35rem] leading-[1.08] text-brand-forest-deep sm:text-5xl lg:text-[3.35rem]">
              Exceptional Loose-Leaf Tea, Chosen for the Cup.
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-brand-muted sm:text-lg">
              Explore carefully selected whole-leaf teas chosen for flavour,
              aroma, origin and character — with simple brewing guidance for
              every cup.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink
                href="/collections/best-sellers"
                size="lg"
                className="min-w-[10.5rem]"
                data-analytics="hero_primary_cta"
              >
                Shop Best Sellers
              </ButtonLink>
              <ButtonLink
                href="/find-your-tea"
                variant="outline"
                size="lg"
                data-analytics="hero_secondary_cta"
              >
                Find Your Tea
              </ButtonLink>
            </div>
            <Link
              href="/shop"
              className="mt-4 inline-block text-sm font-medium text-brand-forest underline-offset-4 hover:underline"
            >
              Shop All Tea →
            </Link>
          </div>
          <HeroVisual hasPhoto={hasHeroPhoto} />
        </div>
      </section>

      {/* Mobile discovery chips — below hero */}
      <div className="border-y border-[var(--brand-line)] bg-white/60 lg:hidden">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {mobileQuickNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-[var(--brand-line)] bg-brand-cream px-3.5 py-2 text-xs text-brand-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Section 2 — Trust */}
      <TrustStrip />

      {/* Section 3 — Best Sellers */}
      <section className="container-wide px-4 py-14 md:py-18">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Best Sellers</h2>
            <p className="mt-2 max-w-xl text-brand-muted">
              Start with teas customers return to — clear flavour, honest
              sourcing, and easy brewing.
            </p>
          </div>
          <Link
            href="/collections/best-sellers"
            className="hidden text-sm font-medium text-brand-forest underline-offset-4 hover:underline sm:inline"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>

      {/* Section 4 — Find Your Tea */}
      <section className="section-soft border-y border-[var(--brand-line)]">
        <div className="container-wide grid items-center gap-8 px-4 py-14 md:grid-cols-[1.2fr_0.8fr] md:py-16">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">
              Not Sure Where to Start?
            </h2>
            <p className="mt-3 max-w-lg text-brand-muted">
              Tell us what flavours, caffeine level and tea moment you prefer.
              We’ll recommend a few teas worth trying.
            </p>
            <ButtonLink
              href="/find-your-tea"
              size="lg"
              className="mt-6"
              data-analytics="find_tea_cta"
            >
              Find My Tea
            </ButtonLink>
          </div>
          <div className="editorial-frame relative aspect-[5/4] overflow-hidden rounded-[var(--radius-lg)] p-8">
            <div className="absolute inset-0 opacity-40" aria-hidden>
              <div className="absolute -right-8 top-6 h-40 w-40 rounded-full bg-brand-gold/30 blur-2xl" />
              <div className="absolute bottom-4 left-6 h-28 w-28 rounded-full bg-brand-forest/20 blur-xl" />
            </div>
            <div className="relative flex h-full flex-col justify-end">
              <p className="font-display text-2xl text-brand-forest-deep">
                Concierge tea matching
              </p>
              <p className="mt-2 text-sm text-brand-muted">
                Flavour · caffeine · strength · occasion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Shop by Tea Type */}
      <section className="container-wide px-4 py-14 md:py-16">
        <div className="mb-8">
          <h2 className="font-display text-3xl md:text-4xl">Shop by Tea Type</h2>
          <p className="mt-2 text-brand-muted">
            Browse the leaf styles that define Lux Leaf.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {teaTypes.map((type) => (
            <Link
              key={type.slug}
              href={`/collections/${type.slug}`}
              className="rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white/80 px-3 py-5 text-center transition-colors hover:border-brand-gold hover:bg-white"
            >
              <span className="font-display text-xl text-brand-forest-deep">
                {type.name}
              </span>
              <span className="mt-1 block text-xs text-brand-muted">
                {type.blurb}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 6 — Why Lux Leaf */}
      <section className="border-y border-[var(--brand-line)] bg-white/70">
        <div className="container-wide px-4 py-14 md:py-16">
          <h2 className="font-display text-3xl md:text-4xl">
            Why Lux Leaf Tea
          </h2>
          <p className="mt-2 max-w-xl text-brand-muted">
            A modern tea boutique — premium without pretension.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title}>
                <p className="font-display text-2xl text-brand-forest-deep">
                  {value.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  {value.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — Tea Guide */}
      <section className="container-wide px-4 py-14 md:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Tea Guide</h2>
            <p className="mt-2 text-brand-muted">
              Practical education that makes premium tea feel approachable.
            </p>
          </div>
          <Link
            href="/tea-guide"
            className="text-sm font-medium text-brand-forest underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/tea-guide/${article.slug}`}
              className="rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white/80 p-5 transition-colors hover:border-brand-gold"
            >
              <p className="text-[11px] tracking-[0.14em] uppercase text-brand-muted">
                {article.category}
              </p>
              <h3 className="mt-2 font-display text-2xl leading-snug text-brand-forest-deep">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-brand-muted">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 8 — Newsletter */}
      <section className="section-soft border-t border-[var(--brand-line)]">
        <div className="container-wide px-4 py-14 md:py-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-3xl text-brand-forest-deep">
              A Better Cup, Occasionally in Your Inbox
            </h2>
            <p className="mt-3 text-brand-muted">
              New tea releases and practical brewing notes — never spam.
            </p>
            <div className="mt-6 text-left">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
