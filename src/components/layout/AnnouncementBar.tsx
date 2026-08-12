import Link from "next/link";

export function AnnouncementBar({ message }: { message?: string }) {
  const text = message || "Free shipping on orders $50+";
  return (
    <div className="bg-brand-forest text-[var(--header-fg)]">
      <div className="container-wide flex h-[var(--announcement-height)] items-center justify-center gap-3 px-4 text-center text-xs tracking-[0.14em] uppercase sm:text-[0.7rem]">
        <span>{text}</span>
        <Link
          href="/shop"
          className="hidden font-medium text-brand-gold underline-offset-4 hover:underline sm:inline"
        >
          Shop Tea
        </Link>
      </div>
    </div>
  );
}
