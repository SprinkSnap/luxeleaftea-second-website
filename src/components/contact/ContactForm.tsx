"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { contactReasons, mailtoHref } from "@/lib/site";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState<string>(contactReasons[0]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const phone = String(form.get("phone") || "");
    const message = String(form.get("message") || "");
    const orderNumber = String(form.get("orderNumber") || "");
    const selectedReason = String(form.get("reason") || reason);

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Reason: ${selectedReason}`,
      orderNumber ? `Order #: ${orderNumber}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    track("contact_action", {
      source: "contact_page",
      type: "form_submit",
      reason: selectedReason,
    });

    const href = `${mailtoHref(selectedReason)}&body=${encodeURIComponent(body)}`;
    // mailto: is an external protocol handler, not an in-app route.
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setSubmitted(true);
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-white/80 p-5 md:p-6">
      <h2 className="font-display text-2xl text-brand-forest-deep">
        Send a message
      </h2>
      <p className="mt-1 text-sm text-brand-muted">
        Keep it short — we’ll follow up by email.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block text-brand-muted">Name</span>
          <input
            name="name"
            required
            autoComplete="name"
            className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-brand-muted">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-brand-muted">
            Phone <span className="text-brand-muted/70">(optional)</span>
          </span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-brand-muted">Reason</span>
          <select
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] bg-white px-3"
          >
            {contactReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        {(reason === "Order question" || reason === "Shipping question") && (
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">
              Order number{" "}
              <span className="text-brand-muted/70">(optional)</span>
            </span>
            <input
              name="orderNumber"
              className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3"
            />
          </label>
        )}
        <label className="block text-sm">
          <span className="mb-1 block text-brand-muted">Message</span>
          <textarea
            name="message"
            required
            rows={5}
            className="w-full rounded-[var(--radius-md)] border border-[var(--brand-line)] px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="h-12 w-full rounded-[var(--radius-md)] bg-brand-forest text-sm font-semibold text-white"
        >
          Open email to send
        </button>
        {submitted && (
          <p className="text-sm text-brand-forest" role="status">
            Your email app should open with your message ready to send.
          </p>
        )}
      </form>
    </div>
  );
}
