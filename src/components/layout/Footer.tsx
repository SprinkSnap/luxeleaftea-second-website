import Link from "next/link";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import {
  footerColumns,
  hasSupportPhone,
  mailtoHref,
  siteConfig,
  telHref,
} from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--brand-line)] bg-brand-forest-deep text-[var(--header-fg)]">
      <div className="container-wide grid gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl text-brand-gold">Lux Leaf Tea</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Premium loose-leaf tea for an elevated everyday ritual — refined,
            calm, and easy to love. Prices in Canadian dollars
            {siteConfig.market === "CA" ? " · Ships across Canada" : ""}.
          </p>
          <div className="mt-5 space-y-2 text-sm text-white/75">
            <p>
              <a
                href={mailtoHref()}
                className="transition-colors hover:text-white"
                data-analytics="footer_email"
              >
                {siteConfig.supportEmail}
              </a>
            </p>
            {hasSupportPhone() && (
              <p>
                <a
                  href={telHref()}
                  className="transition-colors hover:text-white"
                  data-analytics="footer_call"
                >
                  {siteConfig.supportPhone}
                </a>
              </p>
            )}
            {siteConfig.supportHours && (
              <p className="text-white/55">{siteConfig.supportHours}</p>
            )}
          </div>
          <div className="mt-6">
            <NewsletterForm dark />
          </div>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title}>
            <p className="text-xs tracking-[0.18em] uppercase text-brand-gold">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col gap-3 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Secure checkout · Prices in {siteConfig.currency} · Guest checkout
            welcome
          </p>
        </div>
      </div>
    </footer>
  );
}
