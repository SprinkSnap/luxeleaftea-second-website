"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { ecommerce } from "@/lib/analytics";
import { formatMoney } from "@/lib/utils";

export type CartLine = {
  id: string;
  quantity: number;
  variantId: string;
  name: string;
  teaType: string;
  packageSize: string;
  price: number;
  image: string;
  slug: string;
  stockAvailable: number;
};

type CartResponse = {
  id: string;
  items: CartLine[];
  subtotal: number;
  itemCount: number;
};

type CartContextValue = {
  items: CartLine[];
  subtotal: number;
  itemCount: number;
  isOpen: boolean;
  isPending: boolean;
  openCart: () => void;
  closeCart: () => void;
  refresh: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  checkoutLabel: string;
};

const CartContext = createContext<CartContextValue | null>(null);

async function fetchCart(): Promise<CartResponse> {
  const res = await fetch("/api/cart", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load cart");
  return res.json();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [hydrated, setHydrated] = useState(false);

  const applyCart = useCallback((cart: CartResponse) => {
    setItems(cart.items);
    setSubtotal(cart.subtotal);
    setItemCount(cart.itemCount);
  }, []);

  const refresh = useCallback(async () => {
    const cart = await fetchCart();
    applyCart(cart);
  }, [applyCart]);

  useEffect(() => {
    let cancelled = false;
    fetchCart()
      .then((cart) => {
        if (!cancelled) {
          applyCart(cart);
          setHydrated(true);
        }
      })
      .catch(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, [applyCart]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not add to cart");
      }
      const cart = (await res.json()) as CartResponse;
      applyCart(cart);
      setIsOpen(true);
      ecommerce.addToCart({ variantId, quantity });
    },
    [applyCart],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      startTransition(() => {
        void (async () => {
          const res = await fetch("/api/cart", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId, quantity }),
          });
          if (!res.ok) return;
          applyCart(await res.json());
        })();
      });
    },
    [applyCart],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      ecommerce.removeFromCart({ itemId });
      await updateQuantity(itemId, 0);
    },
    [updateQuantity],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      subtotal,
      itemCount,
      isOpen,
      isPending: isPending || !hydrated,
      openCart: () => {
        setIsOpen(true);
        ecommerce.viewCart({ itemCount, subtotal });
      },
      closeCart: () => setIsOpen(false),
      refresh,
      addItem,
      updateQuantity,
      removeItem,
      checkoutLabel: `Checkout — ${formatMoney(subtotal)}`,
    }),
    [
      items,
      subtotal,
      itemCount,
      isOpen,
      isPending,
      hydrated,
      refresh,
      addItem,
      updateQuantity,
      removeItem,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
