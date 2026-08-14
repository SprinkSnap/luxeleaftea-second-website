import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function absoluteUrl(path = "/") {
  const base = siteConfig.url.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Strip brand suffix so the root title template does not duplicate “Lux Leaf Tea”. */
export function cleanPageTitle(title: string) {
  return title
    .replace(/\s*[|—–-]\s*Lux Leaf Tea(?:\s+Guide)?\s*$/i, "")
    .replace(/\s+Lux Leaf Tea\s*$/i, "")
    .trim();
}

export function createMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const pageTitle = cleanPageTitle(title);
  const url = absoluteUrl(path);
  const ogTitle = pageTitle;
  const ogImage = absoluteUrl(image || siteConfig.ogImage);

  return {
    title: pageTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage],
    },
    // Search results: noindex,follow so crawlers can still see the directive
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  const sameAs = Object.values(siteConfig.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo.desktop),
    email: siteConfig.supportEmail,
    ...(siteConfig.supportPhone?.trim()
      ? { telephone: siteConfig.supportPhone.trim() }
      : {}),
    ...(siteConfig.market === "CA" ? { areaServed: "CA" } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: siteConfig.market === "CA" ? "CA" : "US",
      returnPolicyCategory:
        "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 30,
      returnMethod: "https://schema.org/ReturnByMail",
      url: absoluteUrl("/returns"),
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type ProductOfferInput = {
  sku: string;
  url: string;
  price: number;
  currency?: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  packageSize?: string;
};

type ProductReviewInput = {
  authorName: string;
  rating: number;
  body: string;
  datePublished?: string;
};

export function productJsonLd(product: {
  name: string;
  description: string;
  slug: string;
  images: string[];
  sku: string;
  price: number;
  currency?: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  brand?: string;
  offers?: ProductOfferInput[];
  aggregateRating?: { ratingValue: number; reviewCount: number } | null;
  reviews?: ProductReviewInput[];
}) {
  const currency = product.currency || siteConfig.currency;
  const offers =
    product.offers && product.offers.length > 0
      ? product.offers.map((offer) => ({
          "@type": "Offer" as const,
          sku: offer.sku,
          url: absoluteUrl(offer.url),
          priceCurrency: offer.currency || currency,
          price: (offer.price / 100).toFixed(2),
          availability: `https://schema.org/${offer.availability}`,
          itemCondition: "https://schema.org/NewCondition",
          ...(offer.packageSize
            ? { name: `${product.name} — ${offer.packageSize}` }
            : {}),
        }))
      : [
          {
            "@type": "Offer" as const,
            url: absoluteUrl(`/products/${product.slug}`),
            priceCurrency: currency,
            price: (product.price / 100).toFixed(2),
            availability: `https://schema.org/${product.availability}`,
            itemCondition: "https://schema.org/NewCondition",
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images.map((img) => absoluteUrl(img)),
    brand: {
      "@type": "Brand",
      name: product.brand || siteConfig.name,
    },
    url: absoluteUrl(`/products/${product.slug}`),
    offers:
      offers.length > 1
        ? {
            "@type": "AggregateOffer",
            priceCurrency: currency,
            lowPrice: Math.min(
              ...offers.map((o) => Number(o.price)),
            ).toFixed(2),
            highPrice: Math.max(
              ...offers.map((o) => Number(o.price)),
            ).toFixed(2),
            offerCount: offers.length,
            offers,
          }
        : offers[0],
    ...(product.aggregateRating && product.aggregateRating.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.aggregateRating.ratingValue.toFixed(1),
            reviewCount: product.aggregateRating.reviewCount,
          },
        }
      : {}),
    ...(product.reviews && product.reviews.length > 0
      ? {
          review: product.reviews.map((r) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
            },
            author: { "@type": "Person", name: r.authorName },
            reviewBody: r.body,
            ...(r.datePublished ? { datePublished: r.datePublished } : {}),
          })),
        }
      : {}),
  };
}
