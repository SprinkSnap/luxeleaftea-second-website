"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { useCart } from "@/components/providers/CartProvider";
import { categoryNav, mobileQuickNav, primaryNav } from "@/lib/site";
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
          "sticky-header border-b border-white/10 bg-[var(--header-bg)] text-[var(--header-fg)]",
          compact && "shadow-[0_10px_30px_rgba(0,0,0,0.28)]",
        )}
      >
        <div
          className={cn(
            "container-wide grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 transition-[min-height] duration-300 motion-reduce:transition-none",
            compact ? "min-h-16" : "min-h-[4.75rem] lg:min-h-[5.5rem]",
          )}
        >
          {/* Left: menu / desktop nav */}
          <div className="flex items-center gap-2 justify-self-start">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--header-fg)] lg:hidden"
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
                    "text-sm tracking-[0.02em] text-[var(--header-fg)]/88 transition-colors hover:text-brand-gold",
                    item.label === "Shop Tea" && "font-semibold text-brand-gold",
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
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <nav
              aria-label="Secondary"
              className="mr-2 hidden items-center gap-5 lg:flex"
            >
              {primaryNav.slice(3).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-[var(--header-fg)]/88 transition-colors hover:text-brand-gold"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/account"
              className="hidden h-11 w-11 items-center justify-center rounded-md sm:inline-flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 items-center gap-2 rounded-md px-2"
              aria-label={`Cart${itemCount ? ` (${itemCount})` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden text-sm sm:inline">
                Cart{itemCount ? ` (${itemCount})` : ""}
              </span>
              {itemCount > 0 && (
                <span
                  className={cn(
                    "absolute right-0 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cta px-1 text-[11px] font-semibold text-[var(--cta-text)] sm:hidden",
                    badgePop && "cart-badge-pop",
                  )}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop category rail */}
        <div className="hidden border-t border-white/8 lg:block">
          <div className="container-wide flex items-center justify-center gap-7 px-4 py-2.5">
            {categoryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs tracking-[0.16em] uppercase text-[var(--header-fg)]/70 transition-colors hover:text-brand-gold"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile quick chips */}
        <div className="border-t border-white/8 lg:hidden">
          <div className="flex gap-2 overflow-x-auto px-4 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mobileQuickNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-xs text-[var(--header-fg)]/85"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="h-full w-[min(22rem,88vw)] bg-[var(--header-bg)] p-5 text-[var(--header-fg)] shadow-2xl"
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
                  className="rounded-md px-3 py-3 text-base hover:bg-white/5"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/55 p-4 backdrop-blur-sm">
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
