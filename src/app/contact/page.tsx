import { createMetadata, absoluteUrl } from "@/lib/seo";
import { hasSupportPhone, siteConfig } from "@/lib/site";
import { ContactForm } from "@/components/contact/ContactForm";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Contact Lux Leaf Tea",
  description:
    "Contact Lux Leaf Tea for help choosing tea, product questions, orders, shipping, or gift recommendations. Friendly Canadian tea boutique support.",
  path: "/contact",
});

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Lux Leaf Tea",
    url: absoluteUrl("/contact"),
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      email: siteConfig.supportEmail,
      url: siteConfig.url,
      ...(hasSupportPhone()
        ? { telephone: siteConfig.supportPhone }
        : {}),
    },
  };

  return (
    <div className="container-page px-4 py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-2xl">
        <p className="text-[11px] tracking-[0.18em] uppercase text-brand-muted">
          Customer care
        </p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">
          How can we help?
        </h1>
        <p className="mt-3 text-lg text-brand-muted">
          Questions about tea, orders, shipping, or gifts — we’re here, like a
          helpful counter at a tea shop.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-4">
          {hasSupportPhone() && (
            <a
              href={`tel:${siteConfig.supportPhone.replace(/[^\d+]/g, "")}`}
              data-analytics="contact_call"
              className="flex min-h-14 items-center justify-center gap-3 rounded-[var(--radius-md)] bg-cta px-5 text-base font-semibold text-[var(--cta-text)] hover:bg-cta-hover"
            >
              Call us
            </a>
          )}
          <a
            href={`mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent("Question from Contact page")}`}
            data-analytics="contact_email"
            className="flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-brand-forest px-5 text-sm font-medium text-brand-forest"
          >
            Email {siteConfig.supportEmail}
          </a>
          <Link
            href="/find-your-tea"
            className="flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--brand-line)] px-5 text-sm font-medium text-brand-ink"
          >
            Find Your Tea
          </Link>
          <div className="rounded-[var(--radius-md)] bg-brand-mist/70 p-4 text-sm text-brand-muted">
            <p className="font-medium text-brand-ink">What we can help with</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Help choosing tea</li>
              <li>Product questions</li>
              <li>Order &amp; shipping questions</li>
              <li>Gift recommendations</li>
              <li>Wholesale inquiries</li>
            </ul>
            {siteConfig.supportReplyTiming && (
              <p className="mt-3 text-xs">{siteConfig.supportReplyTiming}</p>
            )}
            {siteConfig.supportHours && (
              <p className="mt-2 text-xs">{siteConfig.supportHours}</p>
            )}
          </div>
        </aside>

        <ContactForm />
      </div>
    </div>
  );
}
