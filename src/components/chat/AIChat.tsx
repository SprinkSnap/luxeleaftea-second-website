"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ecommerce } from "@/lib/analytics";
import type { SerializedProductCard } from "@/lib/products";

type Message = {
  role: "assistant" | "user";
  content: string;
  products?: SerializedProductCard[];
};

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello — I’m Lux Leaf’s AI shopping assistant. I can help you discover teas from our catalog by flavour, caffeine, and occasion. I won’t invent products, prices, or policies.",
    },
  ]);

  async function send() {
    const message = input.trim();
    if (!message || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: message }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Assistant unavailable");
      setConversationId(data.conversationId);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply,
          products: data.products,
        },
      ]);
      if (data.products?.[0]) {
        ecommerce.aiRecommendationClicked(data.products[0].id);
      }
    } catch (error) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "The assistant is temporarily unavailable. Browse Shop Tea or email hello@luxleaftea.com.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-brand-forest px-4 text-sm font-medium text-white shadow-lg md:bottom-6"
        aria-haspopup="dialog"
      >
        <MessageCircle className="h-4 w-4" />
        Tea Assistant
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-end bg-black/30 p-3 sm:items-center sm:p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="AI shopping assistant"
            className="flex h-[min(720px,90vh)] w-full max-w-lg flex-col overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--brand-line)] px-4 py-3">
              <div>
                <p className="font-display text-xl text-brand-forest">
                  Tea Assistant
                </p>
                <p className="text-xs text-brand-muted">AI · Catalog-grounded</p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((msg, idx) => (
                <div key={idx}>
                  <div
                    className={
                      msg.role === "user"
                        ? "ml-8 rounded-2xl bg-brand-forest px-3 py-2 text-sm text-white"
                        : "mr-6 rounded-2xl bg-brand-mist px-3 py-2 text-sm text-brand-ink"
                    }
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 grid gap-4">
                      {msg.products.slice(0, 2).map((product) => (
                        <div
                          key={product.id}
                          onClick={() => ecommerce.aiAddToCart(product.id)}
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <p className="text-sm text-brand-muted" role="status">
                  Thinking…
                </p>
              )}
            </div>
            <form
              className="flex gap-2 border-t border-[var(--brand-line)] p-3"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <label className="sr-only" htmlFor="ai-input">
                Message
              </label>
              <input
                id="ai-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. smooth floral, low caffeine"
                className="h-11 flex-1 rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3 text-sm"
              />
              <button
                type="submit"
                className="h-11 rounded-[var(--radius-md)] bg-cta px-4 text-sm font-medium text-[var(--cta-text)]"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
