import { createMetadata } from "@/lib/seo";
import { WishlistClient } from "@/components/product/WishlistClient";

export const metadata = createMetadata({
  title: "Wishlist",
  description: "Saved Lux Leaf Tea favourites.",
  path: "/wishlist",
  noIndex: true,
});

export default function WishlistPage() {
  return (
    <div className="container-wide px-4 py-10 md:py-14">
      <h1 className="font-display text-4xl">Wishlist</h1>
      <p className="mt-2 text-brand-muted">
        Saved teas stay on this device until you sign in and sync.
      </p>
      <div className="mt-8">
        <WishlistClient />
      </div>
    </div>
  );
}
