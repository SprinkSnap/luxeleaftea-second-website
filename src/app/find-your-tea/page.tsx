import { createMetadata } from "@/lib/seo";
import { TeaQuiz } from "@/components/home/TeaQuiz";
import { queryProducts } from "@/lib/products";

export const metadata = createMetadata({
  title: "Find Your Tea",
  description:
    "Answer a few questions and get three personalized Lux Leaf Tea recommendations with clear reasons why.",
  path: "/find-your-tea",
});

export default async function FindYourTeaPage() {
  const products = await queryProducts({});
  return (
    <div className="container-wide px-4 py-10 md:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs tracking-[0.18em] uppercase text-brand-muted">
          Tea Discovery
        </p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Find Your Tea</h1>
        <p className="mt-3 text-brand-muted">
          A short guided path to three teas that match your taste — with Add to
          Cart on every recommendation.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-2xl">
        <TeaQuiz products={products} />
      </div>
    </div>
  );
}
