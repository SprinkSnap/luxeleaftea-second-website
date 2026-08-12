import { ProductGrid } from "@/components/product/ProductGrid";
import { searchAll } from "@/lib/search";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Search",
  description: "Search Lux Leaf Tea products, collections, and tea guides.",
  path: "/search",
});

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = await searchAll(q, 24);

  return (
    <div className="container-wide px-4 py-10 md:py-14">
      <h1 className="font-display text-4xl">Search</h1>
      <form className="mt-6 flex gap-2" action="/search">
        <label className="sr-only" htmlFor="q">
          Search
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Try oolong, floral, morning…"
          className="h-12 flex-1 rounded-[var(--radius-md)] border border-[var(--brand-line)] px-4"
        />
        <button
          type="submit"
          className="h-12 rounded-[var(--radius-md)] bg-cta px-5 text-sm font-medium text-[var(--cta-text)]"
        >
          Search
        </button>
      </form>

      {q && (
        <>
          <h2 className="mt-10 font-display text-2xl">Products</h2>
          <div className="mt-4">
            <ProductGrid products={results.products} />
          </div>
          {results.collections.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl">Collections</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {results.collections.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/collections/${c.slug}`}
                      className="rounded-full border border-[var(--brand-line)] px-3 py-1.5 text-sm"
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
