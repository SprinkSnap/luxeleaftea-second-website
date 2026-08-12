import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Account",
  description: "Manage Lux Leaf Tea orders, addresses, and preferences.",
  path: "/account",
  noIndex: true,
});

export default function AccountPage() {
  return (
    <div className="container-page px-4 py-12">
      <h1 className="font-display text-4xl">Account</h1>
      <p className="mt-3 text-brand-muted">
        Account creation remains optional at checkout. Sign in to sync favourites,
        track orders, and reorder with ease.
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        <li>
          <Link href="/account/orders" className="text-brand-forest underline">
            Orders & Buy Again
          </Link>
        </li>
        <li>
          <Link href="/wishlist" className="text-brand-forest underline">
            Saved favourites
          </Link>
        </li>
        <li>
          <Link href="/privacy" className="text-brand-forest underline">
            Privacy & account deletion
          </Link>
        </li>
      </ul>
    </div>
  );
}
