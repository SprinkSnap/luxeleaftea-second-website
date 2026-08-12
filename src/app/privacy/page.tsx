import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "How Lux Leaf Tea collects and uses personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="container-page px-4 py-12 prose-tea">
      <h1 className="font-display text-4xl">Privacy Policy</h1>
      <p className="mt-4 text-brand-muted">
        We collect only the information needed to fulfill orders, improve the
        shopping experience, and communicate with consent. We never sell personal
        data. Payment card details are handled by Stripe and are not stored on
        our servers.
      </p>
      <p className="text-brand-muted">
        You may request account deletion or marketing preference updates by
        emailing hello@luxleaftea.com.
      </p>
    </div>
  );
}
