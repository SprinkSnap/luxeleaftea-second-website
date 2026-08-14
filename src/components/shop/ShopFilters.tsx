"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const teaTypes = [
  "Green Tea",
  "Black Tea",
  "Oolong",
  "White Tea",
  "Herbal",
  "Pu-erh",
  "Matcha",
];

const sorts = [
  { value: "recommended", label: "Recommended" },
  { value: "best-selling", label: "Best Selling" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price Low–High" },
  { value: "price-desc", label: "Price High–Low" },
];

export function ShopFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
      startTransition(() => {
        router.replace(`?${next.toString()}`, { scroll: false });
      });
    },
    [params, router],
  );

  return (
    <div className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-white/70 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-brand-forest">Filter & sort</p>
        {pending && (
          <span className="text-xs text-brand-muted" role="status">
            Updating…
          </span>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Tea Type</span>
          <select
            className="h-11 w-full rounded-md border border-[var(--brand-line)] bg-white px-3"
            value={params.get("teaType") || "all"}
            onChange={(e) => update("teaType", e.target.value)}
          >
            <option value="all">All</option>
            {teaTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Caffeine</span>
          <select
            className="h-11 w-full rounded-md border border-[var(--brand-line)] bg-white px-3"
            value={params.get("caffeine") || "all"}
            onChange={(e) => update("caffeine", e.target.value)}
          >
            <option value="all">All</option>
            {["None", "Low", "Medium", "High"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Strength</span>
          <select
            className="h-11 w-full rounded-md border border-[var(--brand-line)] bg-white px-3"
            value={params.get("strength") || "all"}
            onChange={(e) => update("strength", e.target.value)}
          >
            <option value="all">All</option>
            {["Light", "Medium", "Strong"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Flavour</span>
          <select
            className="h-11 w-full rounded-md border border-[var(--brand-line)] bg-white px-3"
            value={params.get("flavour") || "all"}
            onChange={(e) => update("flavour", e.target.value)}
          >
            <option value="all">All</option>
            {[
              "Floral",
              "Fruity",
              "Citrus",
              "Earthy",
              "Roasted",
              "Malty",
              "Sweet",
              "Fresh",
              "Smoky",
              "Spiced",
            ].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Origin</span>
          <select
            className="h-11 w-full rounded-md border border-[var(--brand-line)] bg-white px-3"
            value={params.get("origin") || "all"}
            onChange={(e) => update("origin", e.target.value)}
          >
            <option value="all">All</option>
            {["China", "Taiwan", "Japan", "India", "Egypt"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Availability</span>
          <select
            className="h-11 w-full rounded-md border border-[var(--brand-line)] bg-white px-3"
            value={params.get("availability") || "all"}
            onChange={(e) => update("availability", e.target.value)}
          >
            <option value="all">All</option>
            <option value="in-stock">In stock</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-brand-muted">Sort</span>
          <select
            className="h-11 w-full rounded-md border border-[var(--brand-line)] bg-white px-3"
            value={params.get("sort") || "recommended"}
            onChange={(e) => update("sort", e.target.value)}
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={params.get("bestSeller") === "1"}
            onChange={(e) => update("bestSeller", e.target.checked ? "1" : "")}
          />
          Best Sellers
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={params.get("organic") === "1"}
            onChange={(e) => update("organic", e.target.checked ? "1" : "")}
          />
          Organic
        </label>
      </div>
    </div>
  );
}
