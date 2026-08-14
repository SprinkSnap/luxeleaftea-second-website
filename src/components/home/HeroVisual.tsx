import Image from "next/image";
import { siteConfig } from "@/lib/site";

export function HeroVisual({ hasPhoto }: { hasPhoto: boolean }) {
  if (hasPhoto) {
    return (
      <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-lg)] md:aspect-[4/5] lg:aspect-[5/4]">
        <Image
          src={siteConfig.heroImage}
          alt="Premium loose-leaf tea prepared for a calm daily ritual"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 45vw"
        />
      </div>
    );
  }

  return (
    <div
      className="editorial-frame relative aspect-[5/4] overflow-hidden rounded-[var(--radius-lg)] md:aspect-[4/5] lg:min-h-[22rem] lg:aspect-auto"
      aria-label="Premium tea visual placeholder"
    >
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-brand-forest/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-brand-gold/25 blur-3xl" />
        <svg
          viewBox="0 0 400 480"
          className="absolute inset-0 h-full w-full opacity-90"
          role="presentation"
        >
          <ellipse cx="200" cy="290" rx="92" ry="28" fill="#1b3a2f" opacity="0.12" />
          <path
            d="M140 210c20-70 70-110 100-118 30 8 80 48 100 118 6 18-6 30-24 30H164c-18 0-30-12-24-30z"
            fill="#1b3a2f"
            opacity="0.88"
          />
          <path
            d="M168 150c22-8 36 14 28 34M248 142c-20-6-34 18-26 36"
            stroke="#5f8f4c"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="200" cy="248" r="10" fill="#b8923f" opacity="0.85" />
        </svg>
      </div>
      <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
        <p className="text-[11px] tracking-[0.18em] uppercase text-brand-muted">
          Whole-leaf quality
        </p>
        <p className="mt-2 max-w-[14rem] font-display text-2xl text-brand-forest-deep sm:text-3xl">
          Flavour, aroma, and character in every cup.
        </p>
        <p className="mt-3 text-xs text-brand-muted">
          Editorial visual — professional photography can replace this frame.
        </p>
      </div>
    </div>
  );
}
