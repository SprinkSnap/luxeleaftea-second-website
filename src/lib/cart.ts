import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { stockAvailable } from "@/lib/utils";

export const CART_COOKIE = "llt_cart";

const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: true,
          inventory: true,
        },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
};

export type CartWithItems = NonNullable<
  Awaited<ReturnType<typeof getCart>>
>;

/** Read-only cart lookup for Server Components (never mutates cookies). */
export async function getCart() {
  const jar = await cookies();
  const existingId = jar.get(CART_COOKIE)?.value;
  if (!existingId) return null;

  return prisma.cart.findUnique({
    where: { id: existingId },
    include: cartInclude,
  });
}

/** Create or load cart. Only call from Route Handlers / Server Actions. */
export async function getOrCreateCart() {
  const jar = await cookies();
  const existingId = jar.get(CART_COOKIE)?.value;

  if (existingId) {
    const existing = await prisma.cart.findUnique({
      where: { id: existingId },
      include: cartInclude,
    });
    if (existing) return existing;
  }

  const cart = await prisma.cart.create({
    data: {},
    include: cartInclude,
  });

  jar.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return cart;
}

export function cartSubtotal(cart: { items: CartWithItems["items"] }) {
  return cart.items.reduce(
    (sum, item) => sum + item.quantity * item.variant.retailPrice,
    0,
  );
}

export function cartItemCount(cart: { items: CartWithItems["items"] }) {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function addToCart(variantId: string, quantity = 1) {
  const cart = await getOrCreateCart();
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { inventory: true },
  });
  if (!variant || !variant.active) throw new Error("Variant unavailable");

  const available = variant.inventory
    ? stockAvailable(variant.inventory.stockOnHand, variant.inventory.stockReserved)
    : 0;
  if (available < 1) throw new Error("Out of stock");

  const existing = cart.items.find((i) => i.variantId === variantId);
  const nextQty = (existing?.quantity || 0) + quantity;
  if (nextQty > available) throw new Error("Not enough stock");

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: nextQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, variantId, quantity },
    });
  }

  return prisma.cart.findUniqueOrThrow({
    where: { id: cart.id },
    include: cartInclude,
  });
}

export async function updateCartItem(itemId: string, quantity: number) {
  const cart = await getOrCreateCart();
  const item = cart.items.find((i) => i.id === itemId);
  if (!item) throw new Error("Cart item not found");

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    const available = item.variant.inventory
      ? stockAvailable(
          item.variant.inventory.stockOnHand,
          item.variant.inventory.stockReserved,
        )
      : 0;
    if (quantity > available) throw new Error("Not enough stock");
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  return prisma.cart.findUniqueOrThrow({
    where: { id: cart.id },
    include: cartInclude,
  });
}

export async function removeCartItem(itemId: string) {
  return updateCartItem(itemId, 0);
}
