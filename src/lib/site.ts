export const siteConfig = {
  name: "Lux Leaf Tea",
  legalName: "Lux Leaf Tea",
  description:
    "Premium loose-leaf tea for an elevated everyday ritual — selected for flavour, aroma, and quality.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.luxleaftea.com",
  supportEmail: "hello@luxleaftea.com",
  locale: "en_US",
  currency: "USD",
  freeShippingThreshold: 5000,
  logo: {
    desktop: "/images/images/luxe-leaf-tea-logo-1200.webp",
    tablet: "/images/images/luxe-leaf-tea-logo-900-tablet.webp",
    mobile: "/images/images/luxe-leaf-tea-logo-600.webp",
  },
  social: {
    instagram: "https://instagram.com/luxleaftea",
    pinterest: "https://pinterest.com/luxleaftea",
  },
};

export const primaryNav = [
  { href: "/shop", label: "Shop Tea" },
  { href: "/collections/green-tea", label: "Tea Collections" },
  { href: "/find-your-tea", label: "Find Your Tea" },
  { href: "/gifts", label: "Gift Sets" },
  { href: "/tea-guide", label: "Tea Guide" },
  { href: "/about", label: "About" },
];

export const categoryNav = [
  { href: "/collections/green-tea", label: "Green Tea" },
  { href: "/collections/black-tea", label: "Black Tea" },
  { href: "/collections/oolong", label: "Oolong" },
  { href: "/collections/white-tea", label: "White Tea" },
  { href: "/collections/herbal", label: "Herbal" },
  { href: "/gifts", label: "Gift Sets" },
];

export const mobileQuickNav = [
  { href: "/collections/best-sellers", label: "Best Sellers" },
  { href: "/collections/green-tea", label: "Green" },
  { href: "/collections/black-tea", label: "Black" },
  { href: "/collections/oolong", label: "Oolong" },
  { href: "/gifts", label: "Gifts" },
];
