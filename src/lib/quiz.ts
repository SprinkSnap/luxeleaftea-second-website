import type { SerializedProductCard } from "@/lib/products";

export type QuizAnswers = {
  flavour: string;
  caffeine: string;
  strength: string;
  timeOfDay: string;
  occasion: string;
};

export const quizQuestions = [
  {
    id: "flavour",
    prompt: "Which flavour direction draws you in?",
    options: ["Floral", "Fruity", "Earthy", "Sweet", "Roasted", "Bold"],
  },
  {
    id: "caffeine",
    prompt: "How much caffeine do you prefer?",
    options: ["None", "Low", "Medium", "High"],
  },
  {
    id: "strength",
    prompt: "Preferred cup strength?",
    options: ["Light", "Medium", "Strong"],
  },
  {
    id: "timeOfDay",
    prompt: "When do you usually drink tea?",
    options: ["Morning", "Afternoon", "Evening", "After dinner"],
  },
  {
    id: "occasion",
    prompt: "What are you looking for today?",
    options: [
      "Everyday ritual",
      "Something calming",
      "A beautiful gift",
      "Curious discovery",
    ],
  },
] as const;

const flavourMap: Record<string, string[]> = {
  Floral: ["Orchid", "Lilac", "Osmanthus", "White Florals", "Soft Florals", "Fresh Grass"],
  Fruity: ["Honeydew", "Stone Fruit", "Apple", "Dried Plum"],
  Earthy: ["Earth", "Cocoa Husk", "Hay"],
  Sweet: ["Honey", "Chestnut", "Cream", "Sweet Pea"],
  Roasted: ["Toasted Grain", "Cocoa", "Malt"],
  Bold: ["Malt", "Umami", "Cocoa", "Earth"],
};

export function scoreProduct(product: SerializedProductCard, answers: QuizAnswers) {
  let score = 0;
  const reasons: string[] = [];

  const notes = product.flavourNotes.map((n) => n.toLowerCase());
  const wanted = (flavourMap[answers.flavour] || []).map((n) => n.toLowerCase());
  const flavourHits = wanted.filter((w) => notes.some((n) => n.includes(w.split(" ")[0]!)));
  if (flavourHits.length) {
    score += 3 + flavourHits.length;
    reasons.push(`Its ${product.flavourNotes.slice(0, 2).join(" and ").toLowerCase()} notes align with your ${answers.flavour.toLowerCase()} preference.`);
  }

  if (product.caffeineLevel === answers.caffeine) {
    score += 4;
    reasons.push(`Caffeine level is ${product.caffeineLevel.toLowerCase()}, matching your preference.`);
  } else if (
    (answers.caffeine === "Low" && product.caffeineLevel === "None") ||
    (answers.caffeine === "Medium" && ["Low", "High"].includes(product.caffeineLevel))
  ) {
    score += 1;
  }

  if (product.strength === answers.strength) {
    score += 3;
    reasons.push(`Brewed strength sits in the ${product.strength.toLowerCase()} range you asked for.`);
  }

  const time = answers.timeOfDay.toLowerCase();
  if (product.shortDescription && time) {
    // soft match via mood / tea type heuristics
    if (time.includes("morning") && ["Black Tea", "Matcha", "Green Tea"].includes(product.teaType)) {
      score += 2;
      reasons.push("It suits a morning cup without feeling intimidating.");
    }
    if (time.includes("evening") && ["Herbal", "White Tea", "Oolong"].includes(product.teaType)) {
      score += 2;
      reasons.push("It fits a calmer evening pace.");
    }
    if (time.includes("after") && ["Pu-erh", "Black Tea", "Herbal"].includes(product.teaType)) {
      score += 2;
      reasons.push("It works beautifully after dinner.");
    }
    if (time.includes("afternoon") && ["Oolong", "Green Tea", "White Tea"].includes(product.teaType)) {
      score += 2;
      reasons.push("It makes a refined afternoon reset.");
    }
  }

  if (answers.occasion.includes("gift") && (product.isStaffPick || product.isBestSeller)) {
    score += 2;
    reasons.push("It is an especially gift-worthy selection.");
  }
  if (answers.occasion.includes("calming") && ["None", "Low"].includes(product.caffeineLevel)) {
    score += 2;
    reasons.push("Lower caffeine keeps the cup gentle and unwinding.");
  }
  if (product.isBestSeller) score += 1;
  if (product.isStaffPick) score += 1;

  if (!reasons.length) {
    reasons.push(`A thoughtfully made ${product.teaType.toLowerCase()} from ${product.origin}.`);
  }

  return { score, reasons: reasons.slice(0, 3) };
}

export function recommendFromQuiz(
  products: SerializedProductCard[],
  answers: QuizAnswers,
  limit = 3,
) {
  return products
    .map((product) => {
      const { score, reasons } = scoreProduct(product, answers);
      return { product, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
