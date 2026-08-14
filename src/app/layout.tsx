import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AIChat } from "@/components/chat/AIChat";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HelpFab } from "@/components/layout/HelpFab";
import { AnalyticsClickCapture } from "@/components/analytics/AnalyticsClickCapture";
import { CartProvider } from "@/components/providers/CartProvider";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { freeShippingLabel, siteConfig } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Cloudflare Workers + live inventory: request-time rendering keeps stock,
// cart, and catalog data accurate. Do not remove casually — marketing-page
// ISR would require a separate caching/invalidation strategy so inventory
// never goes stale.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      siteConfig.market === "CA"
        ? "Premium Loose Leaf Tea in Canada | Lux Leaf Tea"
        : "Premium Loose Leaf Tea | Lux Leaf Tea",
    template: "%s | Lux Leaf Tea",
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
    locale: siteConfig.locale,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Lux Leaf Tea — Premium loose-leaf tea",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: siteConfig.logo.mobile,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const htmlLang = siteConfig.locale.replace("_", "-");
  return (
    <html lang={htmlLang} className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]),
          }}
        />
        <CartProvider>
          <AnalyticsClickCapture />
          <Header announcement={freeShippingLabel()} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <HelpFab />
          <AIChat />
        </CartProvider>
      </body>
    </html>
  );
}
