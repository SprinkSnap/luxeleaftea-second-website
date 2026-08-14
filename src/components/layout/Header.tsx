"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { useCart } from "@/components/providers/CartProvider";
import { categoryNav, primaryNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header({ announcement }: { announcement?: string }) {
  const { itemCount, openCart } = useCart();
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [badgePop, setBadgePop] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (itemCount <= 0) return;
    const frame = window.requestAnimationFrame(() => setBadgePop(true));
    const t = window.setTimeout(() => setBadgePop(false), 450);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(t);
    };
  }, [itemCount]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar message={announcement} />
      <div
        className={cn(
          "sticky-header border-b border-[var(--brand-line)] bg-[var(--header-bg)]/95 text-[var(--header-fg)] backdrop-blur-md",
          compact && "shadow-[0_8px_24px_rgba(18,38,31,0.06)]",
        )}
      >
        <div
          className={cn(
            "container-wide grid grid-cols-[auto_1fr_auto] items-center gap-2 px-4 transition-[min-height] duration-300 motion-reduce:transition-none lg:grid-cols-[1fr_auto_1fr]",
            compact ? "min-h-14" : "min-h-[3.75rem] md:min-h-16 lg:min-h-[4.5rem]",
          )}
        >
          {/* Left: hamburger / desktop nav */}
          <div className="flex items-center justify-self-start">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-brand-forest lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden />
              <span className="sr-only">Open menu</span>
            </button>
            <nav
              aria-label="Primary"
              className="hidden items-center gap-5 lg:flex"
            >
              {primaryNav.slice(0, 3).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm tracking-[0.04em] text-brand-ink/80 transition-colors hover:text-brand-forest",
                    item.label === "Shop Tea" &&
                      "font-semibold text-brand-forest",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: logo */}
          <div className="justify-self-center">
            <BrandLogo compact={compact} />
          </div>

          {/* Right: utilities */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <nav
              aria-label="Secondary"
              className="mr-2 hidden items-center gap-5 lg:flex"
            >
              {primaryNav.slice(3).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm tracking-[0.04em] text-brand-ink/80 transition-colors hover:text-brand-forest"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-brand-forest"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/account"
              className="hidden h-11 w-11 items-center justify-center rounded-md text-brand-forest lg:inline-flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 items-center gap-2 rounded-md px-2 text-brand-forest"
              aria-label={`Cart${itemCount ? ` (${itemCount})` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden text-sm lg:inline">
                Cart{itemCount ? ` (${itemCount})` : ""}
              </span>
              {itemCount > 0 && (
                <span
                  className={cn(
                    "absolute right-0 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cta px-1 text-[11px] font-semibold text-[var(--cta-text)] lg:hidden",
                    badgePop && "cart-badge-pop",
                  )}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop category rail only — mobile chips moved below hero */}
        <div className="hidden border-t border-[var(--brand-line)] lg:block">
          <div className="container-wide flex items-center justify-center gap-7 px-4 py-2">
            {categoryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[11px] tracking-[0.16em] uppercase text-brand-muted transition-colors hover:text-brand-forest"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="h-full w-[min(22rem,88vw)] bg-brand-cream p-5 text-brand-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="mb-6 flex items-center justify-between">
              <BrandLogo compact />
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-base hover:bg-brand-parchment"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/account"
                className="rounded-md px-3 py-3 text-base hover:bg-brand-parchment"
                onClick={() => setMenuOpen(false)}
              >
                Account
              </Link>
              <Link
                href="/about"
                className="rounded-md px-3 py-3 text-base hover:bg-brand-parchment"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/45 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search teas"
            className="mx-auto mt-16 w-full max-w-xl rounded-[var(--radius-lg)] bg-white p-4 shadow-2xl"
          >
            <form action="/search" className="flex gap-2">
              <label className="sr-only" htmlFor="header-search">
                Search
              </label>
              <input
                id="header-search"
                name="q"
                autoFocus
                placeholder="Search teas, origins, flavours…"
                className="h-12 flex-1 rounded-[var(--radius-md)] border border-[var(--brand-line)] px-4 text-brand-ink"
              />
              <button
                type="submit"
                className="h-12 rounded-[var(--radius-md)] bg-cta px-5 text-sm font-medium text-[var(--cta-text)]"
              >
                Search
              </button>
            </form>
            <button
              type="button"
              className="mt-3 text-sm text-brand-muted"
              onClick={() => setSearchOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
