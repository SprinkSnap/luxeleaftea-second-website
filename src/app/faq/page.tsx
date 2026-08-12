import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "FAQ",
  description: "Frequently asked questions about Lux Leaf Tea shipping, brewing, and orders.",
  path: "/faq",
});

export default async function FaqPage() {
  const faqs = await prisma.faqItem.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="container-page px-4 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="font-display text-4xl">FAQ</h1>
      <dl className="mt-8 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.id}>
            <dt className="font-display text-2xl text-brand-forest">{faq.question}</dt>
            <dd className="mt-2 text-brand-muted">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
