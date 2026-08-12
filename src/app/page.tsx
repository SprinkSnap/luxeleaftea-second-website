import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { getFeaturedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export const metadata = createMetadata({
  title: "Lux Leaf Tea — Exceptional Tea. One Leaf at a Time.",
  description:
    "Discover carefully selected premium loose-leaf teas chosen for exceptional flavour, aroma, and character.",
  path: "/",
});

const teaTypes = [
  { slug: "green-tea", name: "Green Tea", image: "/images/products/dragon-well.svg" },
  { slug: "black-tea", name: "Black Tea", image: "/images/products/assam-golden.svg" },
  { slug: "oolong", name: "Oolong", image: "/images/products/ali-shan.svg" },
  { slug: "white-tea", name: "White Tea", image: "/images/products/silver-needle.svg" },
  { slug: "herbal", name: "Herbal", image: "/images/products/chamomile.svg" },
  { slug: "pu-erh", name: "Pu-erh", image: "/images/products/puerh.svg" },
  { slug: "matcha", name: "Matcha", image: "/images/products/matcha.svg" },
  { slug: "seasonal", name: "Seasonal", image: "/images/products/osmanthus.svg" },
];

const moods = [
  { slug: "morning-energy", name: "Morning Energy" },
  { slug: "afternoon-reset", name: "Afternoon Reset" },
  { slug: "evening-ritual", name: "Evening Ritual" },
  { slug: "after-dinner", name: "After Dinner" },
  { slug: "relax-unwind", name: "Relax & Unwind" },
  { slug: "gift-someone", name: "Gift Someone" },
  { slug: "beginners", name: "Tea for Beginners" },
];

const values = [
  { title: "Premium whole leaves", copy: "Selected for aroma, clarity, and lasting character." },
  { title: "Carefully chosen origins", copy: "Traceable regions and harvests you can trust." },
  { title: "Freshly packed", copy: "Packed to protect flavour from leaf to cup." },
  { title: "Simple brewing guidance", copy: "Clear instructions — no expertise required." },
  { title: "Thoughtful shipping", copy: "Fast, careful fulfillment with free shipping over $50." },
];

export default async function HomePage() {
  const [products, articles] = await Promise.all([
    getFeaturedProducts(8),
    prisma.contentArticle.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <>
      <section className="relative isolate min-h-[calc(100svh-8rem)] overflow-hidden">
        <Image
          src="/images/products/ali-shan.svg"
          alt="Premium loose-leaf tea prepared in a calm boutique setting"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
        <div className="relative container-wide flex min-h-[calc(100svh-8rem)] flex-col justify-end px-4 pb-16 pt-24 text-white sm:justify-center sm:pb-24">
          <p className="animate-fade-up text-xs tracking-[0.28em] uppercase text-brand-gold">
            Premium Loose-Leaf Tea
          </p>
          <h1 className="animate-fade-up-delay mt-4 max-w-xl font-display text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Exceptional Tea. One Leaf at a Time.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
            Discover carefully selected loose-leaf teas chosen for exceptional
            flavour, aroma, and character.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/collections/best-sellers" size="lg">
              Shop Best Sellers
            </ButtonLink>
            <ButtonLink href="/find-your-tea" variant="outline" size="lg" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
              Find My Tea
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="container-wide px-4 py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Shop by Tea Type</h2>
            <p className="mt-2 text-brand-muted">Browse the leaf styles that define Lux Leaf.</p>
          </div>
          <Link href="/shop" className="hidden text-sm text-brand-forest underline-offset-4 hover:underline sm:inline">
            Shop all tea
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {teaTypes.map((type, index) => (
            <Link
              key={type.slug}
              href={`/collections/${type.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)]"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <Image
                src={type.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-4 left-4 font-display text-2xl text-white">
                {type.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white/60 py-16 md:py-20">
        <div className="container-wide px-4">
          <div className="mb-8">
            <h2 className="font-display text-3xl md:text-4xl">Best Sellers</h2>
            <p className="mt-2 text-brand-muted">
              Trusted favourites with clear flavour, thoughtful sourcing, and easy brewing.
            </p>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      <section className="container-wide px-4 py-16 md:py-20">
        <h2 className="font-display text-3xl md:text-4xl">Shop by Mood / Occasion</h2>
        <p className="mt-2 max-w-xl text-brand-muted">
          Fewer decisions. Clear recommendations for the moment you’re in.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {moods.map((mood) => (
            <Link
              key={mood.slug}
              href={`/collections/${mood.slug}`}
              className="rounded-full border border-[var(--brand-line)] bg-white/70 px-4 py-2 text-sm text-brand-ink transition-colors hover:border-brand-gold hover:bg-white"
            >
              {mood.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--brand-line)] bg-brand-forest text-[var(--header-fg)]">
        <div className="container-wide grid gap-8 px-4 py-16 md:grid-cols-5 md:gap-6 md:py-20">
          <div className="md:col-span-2">
            <h2 className="font-display text-3xl text-brand-gold md:text-4xl">
              Why Lux Leaf Tea
            </h2>
            <p className="mt-3 max-w-sm text-white/75">
              A modern tea boutique online — premium without pretension.
            </p>
          </div>
          <ul className="md:col-span-3 space-y-5">
            {values.map((value) => (
              <li key={value.title} className="border-b border-white/10 pb-4">
                <p className="font-medium text-white">{value.title}</p>
                <p className="mt-1 text-sm text-white/70">{value.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-wide px-4 py-16 md:py-20">
        <div className="grid items-center gap-10 rounded-[var(--radius-lg)] bg-[linear-gradient(135deg,#12261f,#1b3a2f_55%,#3a2f1e)] px-6 py-10 text-white md:grid-cols-[1.2fr_1fr] md:px-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-brand-gold">
              Find Your Tea
            </h2>
            <p className="mt-3 max-w-md text-white/80">
              Answer a few calm questions about flavour, caffeine, and ritual.
              We’ll recommend three teas — with reasons — and let you add them
              straight to cart.
            </p>
            <ButtonLink href="/find-your-tea" className="mt-6" size="lg">
              Find My Tea
            </ButtonLink>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)]">
            <Image
              src="/images/products/osmanthus.svg"
              alt="Aromatic oolong leaves suggesting a guided tea discovery"
              fill
              className="object-cover"
              sizes="40vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-white/60 py-16 md:py-20">
        <div className="container-wide px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl md:text-4xl">Tea Guide</h2>
              <p className="mt-2 text-brand-muted">
                Practical education that makes premium tea feel approachable.
              </p>
            </div>
            <Link href="/tea-guide" className="text-sm text-brand-forest underline-offset-4 hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/tea-guide/${article.slug}`}
                className="rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white/80 p-4 transition-colors hover:border-brand-gold"
              >
                <p className="text-xs tracking-[0.14em] uppercase text-brand-muted">
                  {article.category}
                </p>
                <h3 className="mt-2 font-display text-xl leading-snug text-brand-forest-deep">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide px-4 py-16 md:py-20">
        <div className="mx-auto max-w-xl rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-white/80 p-8">
          <h2 className="font-display text-3xl text-brand-forest-deep">
            Join the Lux Leaf Tea Club
          </h2>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
