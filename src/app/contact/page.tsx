import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = createMetadata({
  title: "Contact",
  description: "Contact Lux Leaf Tea for order help, gifting questions, or tea guidance.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-page px-4 py-12 md:py-16">
      <h1 className="font-display text-4xl">Contact</h1>
      <p className="mt-3 text-brand-muted">
        We’re here for brewing questions, gifting help, and order support.
      </p>
      <p className="mt-6">
        Email{" "}
        <a className="text-brand-forest underline" href={`mailto:${siteConfig.supportEmail}`}>
          {siteConfig.supportEmail}
        </a>
      </p>
    </div>
  );
}
