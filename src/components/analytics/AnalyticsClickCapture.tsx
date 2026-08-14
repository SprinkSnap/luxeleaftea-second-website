"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Captures clicks on elements marked with data-analytics without
 * turning every CTA into a client component.
 */
export function AnalyticsClickCapture() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.("[data-analytics]") as HTMLElement | null;
      if (!el) return;
      const name = el.getAttribute("data-analytics");
      if (!name) return;
      track(name, { href: el.getAttribute("href") || undefined });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
