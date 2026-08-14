import { ProductGrid } from "@/components/product/ProductGrid";
import { searchAll } from "@/lib/search";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";
import { TrackOnce } from "@/components/analytics/TrackOnce";

export const metadata = createMetadata({
  title: "Search",
  description: "Search Lux Leaf Tea products, collections, and tea guides.",
  path: "/search",
  noIndex: true,
});

type Props = { searchParams: Promise<{ q?: string }> };

const emptySuggestions = [
  { href: "/collections/green-tea", label: "Green Tea" },
  { href: "/collections/best-sellers", label: "Best Sellers" },
  { href: "/collections/herbal", label: "Herbal" },
  { href: "/find-your-tea", label: "Find Your Tea" },
  { href: "/collections/black-tea", label: "Black Tea" },
  { href: "/gifts", label: "Gifts" },
];

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = await searchAll(q, 24);
  const hasQuery = Boolean(q.trim());
  const emptyProducts =
    hasQuery &&
    results.products.length === 0 &&
    results.collections.length === 0 &&
    results.articles.length === 0;

  return (
    <div className="container-wide px-4 py-10 md:py-14">
      {hasQuery && (
        <TrackOnce event="search" payload={{ search_term: q }} />
      )}
      <h1 className="font-display text-4xl">Search</h1>
      <p className="mt-2 text-brand-muted">
        Search by tea name, type, flavour, origin, or caffeine.
      </p>
      <form className="mt-6 flex flex-col gap-2 sm:flex-row" action="/search">
        <label className="sr-only" htmlFor="q">
          Search tea, flavour, origin
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Search tea, flavour, origin…"
          className="h-12 flex-1 rounded-[var(--radius-md)] border border-[var(--brand-line)] px-4 text-base"
        />
        <button
          type="submit"
          className="h-12 rounded-[var(--radius-md)] bg-cta px-5 text-sm font-medium text-[var(--cta-text)]"
        >
          Search
        </button>
      </form>

      {!hasQuery && (
        <div className="mt-10">
          <p className="text-sm text-brand-muted">Popular starting points</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {emptySuggestions.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-[var(--brand-line)] px-4 py-2 text-sm"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {emptyProducts && (
        <div className="mt-10 rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-brand-mist/50 p-6">
          <p className="font-display text-2xl text-brand-forest-deep">
            No teas matched “{q}”
          </p>
          <p className="mt-2 text-brand-muted">
            Try Green Tea, Best Sellers, Herbal, or Find Your Tea.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {emptySuggestions.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-[var(--brand-line)] bg-white px-4 py-2 text-sm"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasQuery && !emptyProducts && (
        <>
          <h2 className="mt-10 font-display text-2xl">
            Products
            {results.products.length > 0
              ? ` (${results.products.length})`
              : ""}
          </h2>
          <div className="mt-4">
            {results.products.length > 0 ? (
              <ProductGrid products={results.products} />
            ) : (
              <p className="text-sm text-brand-muted">
                No products matched — browse collections below or{" "}
                <Link href="/find-your-tea" className="underline">
                  Find Your Tea
                </Link>
                .
              </p>
            )}
          </div>
          {results.collections.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl">Collections</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {results.collections.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/collections/${c.slug}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-[var(--brand-line)] px-3 py-1.5 text-sm"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.articles.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl">Tea Guide</h2>
              <ul className="mt-3 space-y-2">
                {results.articles.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/tea-guide/${a.slug}`}
                      className="text-brand-forest underline-offset-2 hover:underline"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
