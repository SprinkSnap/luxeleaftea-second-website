"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { HelpCircle, Mail, Phone, X } from "lucide-react";
import {
  hasSupportPhone,
  mailtoHref,
  siteConfig,
  telHref,
} from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Subtle persistent “Need help?” control for mobile high-intent pages.
 * Opens a small panel — never fake live chat, never a disruptive popup.
 */
export function HelpFab() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pathForOpen, setPathForOpen] = useState(pathname);
  const titleId = useId();

  // Close the panel when the route changes (render-time sync, not an effect).
  if (pathname !== pathForOpen) {
    setPathForOpen(pathname);
    if (open) setOpen(false);
  }

  const hide =
    pathname?.startsWith("/admin") ||
    pathname === "/checkout" ||
    pathname === "/cart";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (hide) return null;

  return (
    <div
      className={cn(
        "fixed z-[45] md:hidden",
        "bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] left-4",
      )}
    >
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="mb-2 w-[min(18rem,calc(100vw-2rem))] rounded-[var(--radius-lg)] border border-[var(--brand-line)] bg-white p-4 shadow-xl"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p
                id={titleId}
                className="font-display text-xl text-brand-forest-deep"
              >
                Need help?
              </p>
              <p className="mt-1 text-xs text-brand-muted">
                We’re happy to help you choose — no account required.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
              aria-label="Close help"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="space-y-1">
            {hasSupportPhone() && (
              <li>
                <a
                  href={telHref()}
                  className="flex min-h-11 items-center gap-3 rounded-md px-2 text-sm font-medium text-brand-forest hover:bg-brand-mist"
                  onClick={() => track("phone_click", { source: "help_fab" })}
                  data-analytics="help_fab_call"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  Call us
                </a>
              </li>
            )}
            <li>
              <a
                href={mailtoHref("Question from Lux Leaf Tea")}
                className="flex min-h-11 items-center gap-3 rounded-md px-2 text-sm font-medium text-brand-forest hover:bg-brand-mist"
                onClick={() => track("email_click", { source: "help_fab" })}
                data-analytics="help_fab_email"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Email {siteConfig.supportEmail}
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="flex min-h-11 items-center gap-3 rounded-md px-2 text-sm font-medium text-brand-forest hover:bg-brand-mist"
                onClick={() => {
                  track("contact_action", { source: "help_fab", type: "form" });
                  setOpen(false);
                }}
              >
                Contact form
              </Link>
            </li>
            <li>
              <Link
                href="/find-your-tea"
                className="flex min-h-11 items-center gap-3 rounded-md px-2 text-sm font-medium text-brand-forest hover:bg-brand-mist"
                onClick={() => setOpen(false)}
              >
                Find Your Tea
              </Link>
            </li>
          </ul>
        </div>
      )}
      <button
        type="button"
        className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--brand-line)] bg-white/95 px-3.5 text-sm font-medium text-brand-forest shadow-md backdrop-blur"
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) track("contact_action", { source: "help_fab", type: "open" });
        }}
      >
        <HelpCircle className="h-4 w-4" aria-hidden />
        Need help?
      </button>
    </div>
  );
}
