import { prisma } from "@/lib/prisma";
import { productCardInclude, serializeProductCard } from "@/lib/products";
import { recommendFromQuiz, type QuizAnswers } from "@/lib/quiz";
import { siteConfig } from "@/lib/site";

export type ChatTurn = { role: "user" | "assistant"; content: string };

function inferAnswers(message: string): QuizAnswers {
  const m = message.toLowerCase();
  const flavour = m.includes("floral")
    ? "Floral"
    : m.includes("fruit")
      ? "Fruity"
      : m.includes("earth")
        ? "Earthy"
        : m.includes("roast") || m.includes("toasted")
          ? "Roasted"
          : m.includes("bold") || m.includes("strong")
            ? "Bold"
            : m.includes("sweet") || m.includes("smooth")
              ? "Sweet"
              : "Floral";

  const caffeine = m.includes("no caffeine") || m.includes("caffeine-free") || m.includes("decaf")
    ? "None"
    : m.includes("low caffeine") || m.includes("not too much caffeine") || m.includes("too much caffeine")
      ? "Low"
      : m.includes("high caffeine") || m.includes("energ")
        ? "High"
        : "Medium";

  const strength = m.includes("light") || m.includes("delicate")
    ? "Light"
    : m.includes("strong") || m.includes("bold")
      ? "Strong"
      : "Medium";

  const timeOfDay = m.includes("evening") || m.includes("night")
    ? "Evening"
    : m.includes("morning")
      ? "Morning"
      : m.includes("after dinner")
        ? "After dinner"
        : "Afternoon";

  const occasion = m.includes("gift")
    ? "A beautiful gift"
    : m.includes("calm") || m.includes("relax")
      ? "Something calming"
      : "Everyday ritual";

  return { flavour, caffeine, strength, timeOfDay, occasion };
}

export async function getApprovedCatalog() {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: productCardInclude,
  });
  return products.map(serializeProductCard);
}

export async function answerShoppingAssistant(message: string) {
  const lower = message.toLowerCase();
  const catalog = await getApprovedCatalog();

  // Policy / shipping FAQs from approved content only
  if (lower.includes("shipping")) {
    return {
      reply:
        siteConfig.market === "CA"
          ? `Orders of $${(siteConfig.freeShippingThreshold / 100).toFixed(0)} or more ship free within Canada (prices in ${siteConfig.currency}). Delivery estimates appear at checkout once your address is entered. I can only share shipping details from our published policy — ask our team at ${siteConfig.supportEmail} for exceptions.`
          : `Orders of $${(siteConfig.freeShippingThreshold / 100).toFixed(0)} or more may qualify for free shipping. Delivery estimates appear at checkout. Ask our team at ${siteConfig.supportEmail} for exceptions.`,
      products: [],
    };
  }

  if (lower.includes("return") || lower.includes("refund")) {
    return {
      reply:
        "Unopened products may be returned within 30 days of delivery. I won’t invent return exceptions — our Returns page has the full policy, and our team can help with your order number.",
      products: [],
    };
  }

  if (lower.includes("human") || lower.includes("agent") || lower.includes("speak to")) {
    return {
      reply:
        "I am an AI shopping assistant for Lux Leaf Tea. For account-specific help or anything I cannot verify from our catalog, email hello@luxleaftea.com and a human teammate will assist.",
      products: [],
    };
  }

  const answers = inferAnswers(message);
  const recommendations = recommendFromQuiz(catalog, answers, 3).filter((r) => r.score > 0);

  if (!recommendations.length) {
    return {
      reply:
        "I can help you discover teas from our current catalog. Tell me a flavour direction (floral, fruity, earthy, sweet, roasted, or bold) and your caffeine preference.",
      products: [],
    };
  }

  const lines = recommendations.map(
    (r, i) =>
      `${i + 1}. ${r.product.name} (${r.product.teaType}) — ${r.reasons[0]}`,
  );

  return {
    reply: [
      "I’m Lux Leaf’s AI shopping assistant. Based on what you shared — and only using teas we currently offer — here are thoughtful matches:",
      "",
      ...lines,
      "",
      "You can add any of these to your cart below. If you’d like a gift-focused or caffeine-free shortlist, tell me and I’ll refine from the same catalog.",
    ].join("\n"),
    products: recommendations.map((r) => r.product),
  };
}
