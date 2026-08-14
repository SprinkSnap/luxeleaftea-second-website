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
import { freeShippingLabel, mobileQuickNav, siteConfig } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { TrackOnce } from "@/components/analytics/TrackOnce";

const homepageTitle =
  siteConfig.market === "CA"
    ? "Premium Loose Leaf Tea in Canada"
    : "Premium Loose Leaf Tea";

export const metadata = createMetadata({
  title: homepageTitle,
  description:
    siteConfig.market === "CA"
      ? "Buy premium loose-leaf green, black, oolong, white and herbal tea in Canada. Prices in CAD. Find your perfect cup with brewing guidance from Lux Leaf Tea."
      : siteConfig.description,
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

      {/* 1 — Compact premium hero */}
      <section className="relative overflow-hidden bg-brand-cream">
        <div className="container-wide grid items-center gap-6 px-4 py-8 md:grid-cols-[1.15fr_0.85fr] md:gap-10 md:py-12 lg:min-h-[min(58svh,34rem)] lg:gap-12 lg:py-14">
          <div className="max-w-xl animate-fade-up">
            <p className="font-display text-[1.65rem] leading-none text-brand-forest-deep sm:text-3xl">
              Lux Leaf Tea
            </p>
            <h1 className="mt-3 font-display text-[2.05rem] leading-[1.1] text-brand-forest-deep sm:text-4xl lg:text-[2.85rem]">
              Premium loose-leaf tea, easy to choose.
            </h1>
            <p className="mt-3 max-w-md text-base leading-relaxed text-brand-muted sm:text-lg">
              Green, black, oolong, white, herbal and more — selected for
              flavour, with simple brewing notes for every cup. Prices in{" "}
              {siteConfig.currency}.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ButtonLink
                href="/shop"
                size="lg"
                className="min-w-[10rem]"
                data-analytics="hero_primary_cta"
              >
                Shop Tea
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
          </div>
          <HeroVisual hasPhoto={hasHeroPhoto} />
        </div>
      </section>

      {/* 2 — Search / shop path (mobile-first) */}
      <section className="border-y border-[var(--brand-line)] bg-white/70">
        <div className="container-wide px-4 py-4 md:py-5">
          <form
            action="/search"
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <label className="sr-only" htmlFor="home-search">
              Search tea, flavour, origin
            </label>
            <input
              id="home-search"
              name="q"
              placeholder="Search tea, flavour, origin…"
              className="h-12 flex-1 rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white px-4 text-base"
            />
            <button
              type="submit"
              className="h-12 rounded-[var(--radius-md)] bg-brand-forest px-5 text-sm font-medium text-white"
            >
              Search
            </button>
          </form>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
            {mobileQuickNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-[var(--brand-line)] bg-brand-cream px-3.5 py-2.5 text-xs text-brand-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* 3 — Best Sellers (products quickly) */}
      <section className="container-wide px-4 py-10 md:py-14">
        <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Best Sellers</h2>
            <p className="mt-2 max-w-xl text-brand-muted">
              Start with teas customers return to — clear flavour and easy
              brewing.
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
        <Link
          href="/collections/best-sellers"
          className="mt-6 inline-flex text-sm font-medium text-brand-forest underline-offset-4 hover:underline sm:hidden"
        >
          View all best sellers →
        </Link>
      </section>

      {/* 4 — Shop by Tea Type */}
      <section className="border-y border-[var(--brand-line)] bg-white/60">
        <div className="container-wide px-4 py-10 md:py-14">
          <div className="mb-6 md:mb-8">
            <h2 className="font-display text-3xl md:text-4xl">
              Shop by Tea Type
            </h2>
            <p className="mt-2 text-brand-muted">
              Browse the way you would walk through a tea shop.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {teaTypes.map((type) => (
              <Link
                key={type.slug}
                href={`/collections/${type.slug}`}
                className="min-h-[5.5rem] rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white/90 px-3 py-4 text-center transition-colors hover:border-brand-gold hover:bg-white"
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
        </div>
      </section>

      {/* 5 — Find Your Tea */}
      <section className="section-soft">
        <div className="container-wide grid items-center gap-8 px-4 py-12 md:grid-cols-[1.2fr_0.8fr] md:py-14">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">
              Not sure which tea suits you?
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
              Find Your Tea
            </ButtonLink>
          </div>
          <div className="editorial-frame relative aspect-[5/4] overflow-hidden rounded-[var(--radius-lg)] p-8">
            <div className="absolute inset-0 opacity-40" aria-hidden>
              <div className="absolute -right-8 top-6 h-40 w-40 rounded-full bg-brand-gold/30 blur-2xl" />
              <div className="absolute bottom-4 left-6 h-28 w-28 rounded-full bg-brand-forest/20 blur-xl" />
            </div>
            <div className="relative flex h-full flex-col justify-end">
              <p className="font-display text-2xl text-brand-forest-deep">
                We’ll help you find one
              </p>
              <p className="mt-2 text-sm text-brand-muted">
                Flavour · caffeine · strength · occasion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Why Lux Leaf */}
      <section className="border-y border-[var(--brand-line)] bg-white/70">
        <div className="container-wide px-4 py-12 md:py-14">
          <h2 className="font-display text-3xl md:text-4xl">
            Why Lux Leaf Tea
          </h2>
          <p className="mt-2 max-w-xl text-brand-muted">
            A modern Canadian tea boutique — premium without pretension.{" "}
            {freeShippingLabel()}.
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

      {/* 7 — Tea Guide */}
      <section className="container-wide px-4 py-12 md:py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Tea Guide</h2>
            <p className="mt-2 text-brand-muted">
              Practical notes that make premium tea feel approachable.
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

      {/* 8 — Newsletter */}
      <section className="section-soft border-t border-[var(--brand-line)]">
        <div className="container-wide px-4 py-12 md:py-14">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-3xl text-brand-forest-deep">
              A better cup, occasionally in your inbox
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
