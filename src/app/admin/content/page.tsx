import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin Content",
  description: "Content administration",
  path: "/admin/content",
  noIndex: true,
});

export default async function AdminContentPage() {
  const [articles, faqs, settings] = await Promise.all([
    prisma.contentArticle.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.siteSetting.findMany(),
  ]);

  return (
    <div className="container-wide px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Content</h1>
        <Link href="/admin" className="text-sm underline">
          Dashboard
        </Link>
      </div>
      <section className="mt-8">
        <h2 className="font-display text-2xl">Tea Guide articles</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {articles.map((a) => (
            <li key={a.id} className="rounded-md border border-[var(--brand-line)] bg-white px-3 py-2">
              {a.title} · {a.category}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="font-display text-2xl">FAQs</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {faqs.map((f) => (
            <li key={f.id} className="rounded-md border border-[var(--brand-line)] bg-white px-3 py-2">
              {f.question}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="font-display text-2xl">Site settings</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {settings.map((s) => (
            <li key={s.id} className="rounded-md border border-[var(--brand-line)] bg-white px-3 py-2">
              <span className="font-medium">{s.key}</span>: {s.value}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
