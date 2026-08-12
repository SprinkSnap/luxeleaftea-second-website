import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page px-4 py-24 text-center">
      <h1 className="font-display text-5xl text-brand-forest">Page not found</h1>
      <p className="mt-3 text-brand-muted">
        This page may have moved — continue browsing the boutique.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] bg-cta px-5 text-sm font-medium text-[var(--cta-text)]"
        >
          Home
        </Link>
        <Link
          href="/shop"
          className="inline-flex h-11 items-center rounded-[var(--radius-md)] border border-[var(--brand-line)] px-5 text-sm"
        >
          Shop Tea
        </Link>
      </div>
    </div>
  );
}
