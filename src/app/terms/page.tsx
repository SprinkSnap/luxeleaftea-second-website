import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: "Terms of service for Lux Leaf Tea.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="container-page px-4 py-12 prose-tea">
      <h1 className="font-display text-4xl">Terms of Service</h1>
      <p className="mt-4 text-brand-muted">
        By purchasing from Lux Leaf Tea you agree to accurate order information,
        our shipping and returns policies, and lawful use of the website. Product
        availability and pricing may change as inventory updates.
      </p>
    </div>
  );
}
