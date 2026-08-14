"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, Menu, Phone, Search, ShoppingBag, User, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { useCart } from "@/components/providers/CartProvider";
import {
  categoryNav,
  hasSupportPhone,
  mailtoHref,
  mobileMenuSections,
  primaryNav,
  siteConfig,
  telHref,
} from "@/lib/site";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export function Header({ announcement }: { announcement?: string }) {
  const pathname = usePathname();
  const checkoutMode = pathname === "/checkout";
  const { itemCount, openCart } = useCart();
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [badgePop, setBadgePop] = useState(false);
  const menuTitleId = useId();
  const searchTitleId = useId();
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (menuOpen) menuCloseRef.current?.focus();
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, searchOpen]);

  // Desktop: split nav around logo without overcrowding (Contact stays visible)
  const leftNav = primaryNav.slice(0, 3);
  const rightNav = primaryNav.slice(3);

  return (
    <header className="sticky top-0 z-50">
      {!checkoutMode && <AnnouncementBar message={announcement} />}
      <div
        className={cn(
          "sticky-header border-b border-[var(--brand-line)] bg-[var(--header-bg)]/95 text-[var(--header-fg)] backdrop-blur-md",
          compact && !checkoutMode && "shadow-[0_8px_24px_rgba(18,38,31,0.06)]",
        )}
      >
        {checkoutMode ? (
          <div className="container-wide flex min-h-14 items-center justify-between gap-3 px-4">
            <BrandLogo compact />
            <div className="flex items-center gap-4 text-sm">
              <span className="hidden text-brand-muted sm:inline">
                Secure checkout · {siteConfig.currency}
              </span>
              <Link
                href="/contact"
                className="font-medium text-brand-forest underline-offset-2 hover:underline"
              >
                Need help?
              </Link>
            </div>
          </div>
        ) : (
        <>
        <div
          className={cn(
            "container-wide grid grid-cols-[auto_1fr_auto] items-center gap-2 px-4 transition-[min-height] duration-300 motion-reduce:transition-none lg:grid-cols-[1fr_auto_1fr]",
            compact
              ? "min-h-14"
              : "min-h-[4.25rem] md:min-h-[4.5rem] lg:min-h-[5rem]",
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
              className="hidden items-center gap-4 xl:gap-5 lg:flex"
            >
              {leftNav.map((item) => (
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
              className="mr-1 hidden items-center gap-4 xl:gap-5 lg:flex"
            >
              {rightNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm tracking-[0.04em] text-brand-ink/80 transition-colors hover:text-brand-forest",
                    item.label === "Contact" && "font-medium text-brand-forest",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-md px-2 text-brand-forest"
              onClick={() => setSearchOpen(true)}
              aria-label="Search tea"
            >
              <Search className="h-5 w-5" />
              <span className="hidden text-sm xl:inline">Search</span>
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

        {/* Desktop category rail */}
        <div className="hidden border-t border-[var(--brand-line)] lg:block">
          <div className="container-wide flex items-center justify-center gap-6 px-4 py-2 xl:gap-7">
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
        </>
        )}
      </div>

      {!checkoutMode && menuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="flex h-full w-[min(22rem,92vw)] flex-col bg-brand-cream text-brand-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={menuTitleId}
          >
            <div className="flex items-center justify-between border-b border-[var(--brand-line)] px-4 py-3">
              <p id={menuTitleId} className="sr-only">
                Menu
              </p>
              <BrandLogo compact />
              <button
                ref={menuCloseRef}
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <p className="mb-4 text-sm text-brand-muted">
                Welcome — how can we help you find the right tea?
              </p>

              {mobileMenuSections.map((section) => (
                <div key={section.id} className="mb-6">
                  <p className="mb-2 text-[11px] font-medium tracking-[0.16em] uppercase text-brand-muted">
                    {section.title}
                  </p>
                  <nav
                    aria-label={section.title}
                    className="flex flex-col gap-0.5"
                  >
                    {section.links.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="min-h-11 rounded-md px-3 py-2.5 text-base text-brand-ink hover:bg-brand-parchment"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  {section.id === "help" && (
                    <div className="mt-3 space-y-2 rounded-[var(--radius-md)] bg-brand-parchment/80 p-3">
                      {hasSupportPhone() && (
                        <a
                          href={telHref()}
                          className="flex min-h-11 items-center gap-3 rounded-md px-2 text-base font-medium text-brand-forest"
                          onClick={() => {
                            track("phone_click", { source: "mobile_menu" });
                            setMenuOpen(false);
                          }}
                          data-analytics="menu_call"
                        >
                          <Phone className="h-4 w-4 shrink-0" aria-hidden />
                          Call Us
                        </a>
                      )}
                      <a
                        href={mailtoHref("Question from Lux Leaf Tea website")}
                        className="flex min-h-11 items-center gap-3 rounded-md px-2 text-base font-medium text-brand-forest"
                        onClick={() => {
                          track("email_click", { source: "mobile_menu" });
                          setMenuOpen(false);
                        }}
                        data-analytics="menu_email"
                      >
                        <Mail className="h-4 w-4 shrink-0" aria-hidden />
                        Email Us
                      </a>
                      <p className="px-2 text-xs text-brand-muted">
                        {siteConfig.supportEmail}
                        {hasSupportPhone()
                          ? ` · ${siteConfig.supportPhone}`
                          : ""}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!checkoutMode && searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/45 p-4 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={searchTitleId}
            className="mx-auto mt-12 w-full max-w-xl rounded-[var(--radius-lg)] bg-white p-5 shadow-2xl sm:mt-16"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id={searchTitleId}
              className="font-display text-2xl text-brand-forest-deep"
            >
              Search tea
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Try a name, flavour, origin, or caffeine level.
            </p>
            <form action="/search" className="mt-4 flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="header-search">
                Search tea, flavour, origin
              </label>
              <input
                ref={searchInputRef}
                id="header-search"
                name="q"
                placeholder="Search tea, flavour, origin…"
                className="h-12 flex-1 rounded-[var(--radius-md)] border border-[var(--brand-line)] px-4 text-base text-brand-ink"
              />
              <button
                type="submit"
                className="h-12 rounded-[var(--radius-md)] bg-cta px-6 text-sm font-medium text-[var(--cta-text)]"
              >
                Search
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { href: "/collections/green-tea", label: "Green Tea" },
                { href: "/collections/best-sellers", label: "Best Sellers" },
                { href: "/collections/herbal", label: "Herbal" },
                { href: "/find-your-tea", label: "Find Your Tea" },
              ].map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={() => setSearchOpen(false)}
                  className="rounded-full border border-[var(--brand-line)] px-3 py-1.5 text-xs text-brand-muted hover:border-brand-gold hover:text-brand-forest"
                >
                  {s.label}
                </Link>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 min-h-11 text-sm text-brand-muted underline-offset-2 hover:underline"
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
