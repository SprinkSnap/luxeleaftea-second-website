"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { ecommerce } from "@/lib/analytics";
import type { SerializedProductCard } from "@/lib/products";
import {
  quizQuestions,
  recommendFromQuiz,
  type QuizAnswers,
} from "@/lib/quiz";

const empty: QuizAnswers = {
  flavour: "",
  caffeine: "",
  strength: "",
  timeOfDay: "",
  occasion: "",
};

export function TeaQuiz({ products }: { products: SerializedProductCard[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(empty);
  const [started, setStarted] = useState(false);

  const complete = Object.values(answers).every(Boolean);
  const results = useMemo(
    () => (complete ? recommendFromQuiz(products, answers, 3) : []),
    [answers, complete, products],
  );

  function choose(questionId: keyof QuizAnswers, value: string) {
    if (!started) {
      setStarted(true);
      ecommerce.quizStarted();
    }
    const next = { ...answers, [questionId]: value };
    setAnswers(next);
    if (step < quizQuestions.length - 1) setStep(step + 1);
    if (
      step === quizQuestions.length - 1 &&
      Object.values({ ...next }).every(Boolean)
    ) {
      ecommerce.quizCompleted(next);
    }
  }

  if (complete) {
    return (
      <div className="space-y-8">
        <div className="rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-white/80 p-6 text-center">
          <h2 className="font-display text-3xl text-brand-forest">
            Your matches
          </h2>
          <p className="mt-2 text-brand-muted">
            Three teas from our catalog, with reasons tied to your answers.
          </p>
          <button
            type="button"
            className="mt-4 text-sm text-brand-forest underline"
            onClick={() => {
              setAnswers(empty);
              setStep(0);
              setStarted(false);
            }}
          >
            Start over
          </button>
        </div>
        <div className="grid gap-8">
          {results.map(({ product, reasons }) => (
            <div key={product.id}>
              <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-brand-muted">
                {reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const question = quizQuestions[step]!;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-white/80 p-6 md:p-8">
      <p className="text-xs tracking-[0.14em] uppercase text-brand-muted">
        Question {step + 1} of {quizQuestions.length}
      </p>
      <h2 className="mt-3 font-display text-3xl text-brand-forest-deep">
        {question.prompt}
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => choose(question.id as keyof QuizAnswers, option)}
            className="rounded-[var(--radius-md)] border border-[var(--brand-line)] px-4 py-3 text-left text-sm transition-colors hover:border-brand-gold hover:bg-brand-mist/60"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
