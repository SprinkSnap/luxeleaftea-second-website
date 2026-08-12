"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const KEY = "llt_wishlist";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("llt:wishlist", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("llt:wishlist", onStoreChange);
  };
}

function getSnapshot() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw || "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot() {
  return "[]";
}

export function WishlistClient() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ids = JSON.parse(raw) as string[];

  if (!ids.length) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--brand-line)] px-6 py-14 text-center">
        <p className="font-display text-2xl">No saved teas yet</p>
        <Link href="/shop" className="mt-4 inline-block text-brand-forest underline">
          Browse the boutique
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-2 text-sm">
      {ids.map((id) => (
        <li key={id} className="rounded-md border border-[var(--brand-line)] px-4 py-3">
          Saved product id: {id}
        </li>
      ))}
    </ul>
  );
}

export function toggleWishlist(productId: string) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(KEY);
  const ids: string[] = raw ? JSON.parse(raw) : [];
  const next = ids.includes(productId)
    ? ids.filter((id) => id !== productId)
    : [...ids, productId];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("llt:wishlist"));
}
