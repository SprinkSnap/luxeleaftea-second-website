/**
 * Centralized storefront configuration.
 * Do not invent business facts — phone/address/hours only appear when configured.
 */

export const siteConfig = {
  name: "Lux Leaf Tea",
  legalName: "Lux Leaf Tea",
  description:
    "Shop premium loose-leaf green, black, oolong, white and herbal teas in Canada. Selected for flavour, aroma and character — with simple brewing guidance for every cup. Prices in CAD.",
  /**
   * Canonical production host. Prefer NEXT_PUBLIC_SITE_URL in deployment.
   * Keep www vs apex consistent with hosting redirects.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://luxeleaftea.ca",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@luxleaftea.com",
  /**
   * Optional verified phone. When unset, Call actions are omitted (never invent).
   * Example: NEXT_PUBLIC_SUPPORT_PHONE="+1XXXXXXXXXX"
   */
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "",
  /**
   * Optional public reply timing copy — only set if the business can honour it.
   * Example: NEXT_PUBLIC_SUPPORT_REPLY_TIMING="We typically reply within 1–2 business days."
   */
  supportReplyTiming: process.env.NEXT_PUBLIC_SUPPORT_REPLY_TIMING || "",
  /**
   * Optional verified business hours for contact/footer — omit when unknown.
   */
  supportHours: process.env.NEXT_PUBLIC_SUPPORT_HOURS || "",
  /**
   * Locale for Open Graph / formatting. Canada-first storefront.
   */
  locale: process.env.NEXT_PUBLIC_LOCALE || "en_CA",
  /** Storefront + Stripe currency must agree. Default CAD for Canadian market. */
  currency: process.env.NEXT_PUBLIC_CURRENCY || "CAD",
  market: process.env.NEXT_PUBLIC_MARKET || "CA",
  defaultCountry: process.env.NEXT_PUBLIC_DEFAULT_COUNTRY || "CA",
  /** Free shipping threshold in integer cents (CAD $50). */
  freeShippingThreshold: Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_CENTS || 5000),
  /** Standard domestic shipping in integer cents when below free threshold. */
  standardShippingCents: Number(process.env.NEXT_PUBLIC_STANDARD_SHIPPING_CENTS || 695),
  /**
   * Tax presentation mode:
   * - "stripe" — tax collected/calculated by Stripe Checkout (preferred when enabled)
   * - "estimate" — never show a hard-coded Canadian rate as fact; defer to payment
   */
  taxMode: (process.env.NEXT_PUBLIC_TAX_MODE || "stripe") as "stripe" | "estimate",
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

export function hasSupportPhone() {
  return Boolean(siteConfig.supportPhone?.trim());
}

export function telHref() {
  const raw = siteConfig.supportPhone.trim();
  if (!raw) return "";
  return `tel:${raw.replace(/[^\d+]/g, "")}`;
}

export function mailtoHref(subject?: string) {
  const base = `mailto:${siteConfig.supportEmail}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

export function freeShippingLabel() {
  const dollars = (siteConfig.freeShippingThreshold / 100).toFixed(0);
  return siteConfig.market === "CA"
    ? `Free shipping on orders $${dollars}+ CAD`
    : `Free shipping on orders $${dollars}+`;
}

export function currencyCode() {
  return siteConfig.currency.toUpperCase();
}

/** Desktop primary navigation — Contact is a first-class destination. */
export const primaryNav = [
  { href: "/shop", label: "Shop Tea" },
  { href: "/collections/green-tea", label: "Tea Types" },
  { href: "/collections/best-sellers", label: "Best Sellers" },
  { href: "/find-your-tea", label: "Find Your Tea" },
  { href: "/gifts", label: "Gifts" },
  { href: "/tea-guide", label: "Tea Guide" },
  { href: "/contact", label: "Contact" },
];

export const categoryNav = [
  { href: "/collections/green-tea", label: "Green Tea" },
  { href: "/collections/black-tea", label: "Black Tea" },
  { href: "/collections/oolong", label: "Oolong" },
  { href: "/collections/white-tea", label: "White Tea" },
  { href: "/collections/herbal", label: "Herbal" },
  { href: "/collections/matcha", label: "Matcha" },
  { href: "/gifts", label: "Gift Sets" },
];

/** Discovery chips shown below the hero on mobile — not in the header. */
export const mobileQuickNav = [
  { href: "/collections/best-sellers", label: "Best Sellers" },
  { href: "/collections/green-tea", label: "Green" },
  { href: "/collections/black-tea", label: "Black" },
  { href: "/collections/oolong", label: "Oolong" },
  { href: "/collections/herbal", label: "Herbal" },
  { href: "/gifts", label: "Gifts" },
];

/** Structured mobile drawer — feels like speaking to a tea-shop associate. */
export const mobileMenuSections = [
  {
    id: "shop",
    title: "Shop",
    links: [
      { href: "/shop", label: "Shop All Tea" },
      { href: "/collections/best-sellers", label: "Best Sellers" },
      { href: "/collections/green-tea", label: "Green Tea" },
      { href: "/collections/black-tea", label: "Black Tea" },
      { href: "/collections/oolong", label: "Oolong" },
      { href: "/collections/white-tea", label: "White Tea" },
      { href: "/collections/herbal", label: "Herbal" },
      { href: "/collections/matcha", label: "Matcha" },
      { href: "/collections/pu-erh", label: "Pu-erh" },
      { href: "/gifts", label: "Gifts" },
    ],
  },
  {
    id: "help",
    title: "Need Help?",
    links: [
      { href: "/find-your-tea", label: "Find Your Tea" },
      { href: "/contact", label: "Contact Us" },
      { href: "/faq", label: "FAQ" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
    ],
  },
  {
    id: "account",
    title: "Account",
    links: [
      { href: "/account", label: "Account / Orders" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/about", label: "About Lux Leaf" },
    ],
  },
] as const;

export const footerColumns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "Shop All" },
      { href: "/collections/best-sellers", label: "Best Sellers" },
      { href: "/collections/green-tea", label: "Tea Types" },
      { href: "/gifts", label: "Gifts" },
      { href: "/find-your-tea", label: "Find Your Tea" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/account/orders", label: "Order Tracking" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/tea-guide", label: "Tea Guide" },
      { href: "/tea-guide/how-to-brew-loose-leaf-tea", label: "Brewing guides" },
      { href: "/about", label: "About" },
      { href: "/wishlist", label: "Wishlist" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
] as const;

/** Canadian provinces & territories for checkout. */
export const canadianProvinces = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
] as const;

export const supportedCountries = [
  { code: "CA", name: "Canada" },
  { code: "US", name: "United States" },
] as const;

/** Contact form reasons — help customers self-route. */
export const contactReasons = [
  "Help choosing tea",
  "Product question",
  "Order question",
  "Shipping question",
  "Gift recommendation",
  "Wholesale inquiry",
  "Other",
] as const;

/** Map product.teaType (e.g. "Green Tea") to collection slug. */
export function collectionSlugForTeaType(teaType: string): string {
  const normalized = teaType.trim().toLowerCase();
  const map: Record<string, string> = {
    green: "green-tea",
    "green tea": "green-tea",
    black: "black-tea",
    "black tea": "black-tea",
    oolong: "oolong",
    white: "white-tea",
    "white tea": "white-tea",
    herbal: "herbal",
    "pu-erh": "pu-erh",
    puerh: "pu-erh",
    "pu erh": "pu-erh",
    matcha: "matcha",
  };
  return map[normalized] || "best-sellers";
}
