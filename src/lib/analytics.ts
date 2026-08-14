"use client";

type EventPayload = Record<string, unknown>;

export function track(event: string, payload: EventPayload = {}) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("llt:analytics", { detail: { event, payload } }),
  );

  // GA4-compatible dataLayer if present
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...payload });

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: event, payload }),
    keepalive: true,
  }).catch(() => undefined);
}

export const ecommerce = {
  viewItemList: (items: unknown[]) =>
    track("view_item_list", { items, currency: process.env.NEXT_PUBLIC_CURRENCY || "CAD" }),
  selectItem: (item: unknown) => track("select_item", { item }),
  viewItem: (item: unknown) => track("view_item", { item }),
  addToCart: (item: unknown) => track("add_to_cart", { item }),
  removeFromCart: (item: unknown) => track("remove_from_cart", { item }),
  viewCart: (cart: unknown) => track("view_cart", { cart }),
  beginCheckout: (cart: unknown) => track("begin_checkout", { cart }),
  addShippingInfo: (payload: EventPayload = {}) =>
    track("add_shipping_info", payload),
  addPaymentInfo: (payload: EventPayload = {}) =>
    track("add_payment_info", payload),
  purchase: (order: unknown) => track("purchase", { order }),
  search: (q: string) => track("search", { search_term: q }),
  quizStarted: () => track("tea_quiz_started"),
  quizCompleted: (answers: unknown) => track("tea_quiz_completed", { answers }),
  aiRecommendationClicked: (productId: string) =>
    track("ai_recommendation_clicked", { productId }),
  aiAddToCart: (productId: string) => track("ai_add_to_cart", { productId }),
  newsletterSignup: () => track("newsletter_signup"),
  contactAction: (payload: EventPayload) => track("contact_action", payload),
  phoneClick: (payload: EventPayload = {}) => track("phone_click", payload),
  emailClick: (payload: EventPayload = {}) => track("email_click", payload),
};
