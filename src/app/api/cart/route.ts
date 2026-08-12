import { NextResponse } from "next/server";
import {
  addToCart,
  cartItemCount,
  cartSubtotal,
  getOrCreateCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/cart";
import { parseJsonArray, stockAvailable } from "@/lib/utils";

function serializeCart(cart: Awaited<ReturnType<typeof getOrCreateCart>>) {
  return {
    id: cart.id,
    subtotal: cartSubtotal(cart),
    itemCount: cartItemCount(cart),
    items: cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      variantId: item.variantId,
      name: item.variant.product.name,
      teaType: item.variant.product.teaType,
      packageSize: item.variant.packageSize,
      price: item.variant.retailPrice,
      image: parseJsonArray(item.variant.product.images)[0] || "",
      slug: item.variant.product.slug,
      stockAvailable: item.variant.inventory
        ? stockAvailable(
            item.variant.inventory.stockOnHand,
            item.variant.inventory.stockReserved,
          )
        : 0,
    })),
  };
}

export async function GET() {
  const cart = await getOrCreateCart();
  return NextResponse.json(serializeCart(cart));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const variantId = String(body.variantId || "");
    const quantity = Number(body.quantity || 1);
    if (!variantId || quantity < 1) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const cart = await addToCart(variantId, quantity);
    return NextResponse.json(serializeCart(cart));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not add item" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const itemId = String(body.itemId || "");
    const quantity = Number(body.quantity);
    if (!itemId || Number.isNaN(quantity)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const cart =
      quantity <= 0
        ? await removeCartItem(itemId)
        : await updateCartItem(itemId, quantity);
    return NextResponse.json(serializeCart(cart));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update cart" },
      { status: 400 },
    );
  }
}
