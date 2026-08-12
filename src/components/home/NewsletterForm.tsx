"use client";

import { useState } from "react";
import { ecommerce } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      setEmail("");
      ecommerce.newsletterSignup();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className={cn("text-sm", dark ? "text-white/80" : "text-brand-muted")}>
        Join the Lux Leaf Tea Club for new releases, brewing guides, and private
        offers.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className={cn(
            "h-11 flex-1 rounded-[var(--radius-md)] px-3 text-sm",
            dark
              ? "border border-white/20 bg-white/5 text-white placeholder:text-white/40"
              : "border border-[var(--brand-line)] bg-white text-brand-ink",
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 rounded-[var(--radius-md)] bg-cta px-4 text-sm font-medium text-[var(--cta-text)]"
        >
          {status === "loading" ? "Joining…" : "Join the Club"}
        </button>
      </div>
      {status === "done" && (
        <p className="text-sm text-brand-leaf" role="status">
          Welcome — check your inbox for a confirmation soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-300" role="alert">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
