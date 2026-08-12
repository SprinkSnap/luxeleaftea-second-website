import Link from "next/link";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "Shop Tea" },
      { href: "/collections/green-tea", label: "Collections" },
      { href: "/find-your-tea", label: "Find Your Tea" },
      { href: "/gifts", label: "Gift Sets" },
      { href: "/wishlist", label: "Wishlist" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/tea-guide", label: "Tea Guide" },
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/account", label: "Account" },
      { href: "/account/orders", label: "Order Tracking" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--brand-line)] bg-brand-forest-deep text-[var(--header-fg)]">
      <div className="container-wide grid gap-10 px-4 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl text-brand-gold">Lux Leaf Tea</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Premium loose-leaf tea for an elevated everyday ritual — refined,
            calm, and easy to love.
          </p>
          <div className="mt-6">
            <NewsletterForm dark />
          </div>
        </div>
        {columns.map((col) => (
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
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Secure checkout · Accessible design · Crafted for tea lovers</p>
        </div>
      </div>
    </footer>
  );
}
