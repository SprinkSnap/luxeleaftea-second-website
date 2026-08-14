export const siteConfig = {
  name: "Lux Leaf Tea",
  legalName: "Lux Leaf Tea",
  description:
    "Shop premium loose-leaf green, black, oolong, white and herbal teas selected for exceptional flavour, aroma and character. Brewing guidance included.",
  /**
   * Canonical production host. Prefer NEXT_PUBLIC_SITE_URL in deployment.
   * Production screenshot / worker hosting may use luxeleaftea.ca —
   * keep www vs apex consistent with hosting redirects.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://luxeleaftea.ca",
  supportEmail: "hello@luxleaftea.com",
  /**
   * Locale for Open Graph / formatting. Use NEXT_PUBLIC_LOCALE=en_CA for Canada.
   * Currency is separate — do not assume CAD until Stripe account confirms it.
   */
  locale: process.env.NEXT_PUBLIC_LOCALE || "en_CA",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "USD",
  market: process.env.NEXT_PUBLIC_MARKET || "CA",
  freeShippingThreshold: 5000,
  logo: {
    desktop: "/images/images/luxe-leaf-tea-logo-1200.webp",
    tablet: "/images/images/luxe-leaf-tea-logo-900-tablet.webp",
    mobile: "/images/images/luxe-leaf-tea-logo-600.webp",
  },
  /** Preferred future hero photography path (graceful fallback until supplied). */
  heroImage: "/images/brand/lux-leaf-premium-tea-hero.webp",
  /** Static social share image (1200×630) — avoid next/og WASM in the Worker bundle. */
  ogImage: "/images/brand/og-default.png",
  /** Only include real profiles — set via env when verified. */
  social: {
    ...(process.env.NEXT_PUBLIC_INSTAGRAM_URL
      ? { instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL }
      : {}),
    ...(process.env.NEXT_PUBLIC_PINTEREST_URL
      ? { pinterest: process.env.NEXT_PUBLIC_PINTEREST_URL }
      : {}),
  } as Record<string, string>,
};

export const primaryNav = [
  { href: "/shop", label: "Shop Tea" },
  { href: "/collections/green-tea", label: "Tea Types" },
  { href: "/collections/best-sellers", label: "Best Sellers" },
  { href: "/tea-guide", label: "Tea Guide" },
  { href: "/gifts", label: "Gifts" },
  { href: "/find-your-tea", label: "Find Your Tea" },
];

export const categoryNav = [
  { href: "/collections/green-tea", label: "Green Tea" },
  { href: "/collections/black-tea", label: "Black Tea" },
  { href: "/collections/oolong", label: "Oolong" },
  { href: "/collections/white-tea", label: "White Tea" },
  { href: "/collections/herbal", label: "Herbal" },
  { href: "/gifts", label: "Gift Sets" },
];

/** Discovery chips shown below the hero on mobile — not in the header. */
export const mobileQuickNav = [
  { href: "/collections/best-sellers", label: "Best Sellers" },
  { href: "/collections/green-tea", label: "Green" },
  { href: "/collections/black-tea", label: "Black" },
  { href: "/collections/oolong", label: "Oolong" },
  { href: "/gifts", label: "Gifts" },
];
