import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { cartSubtotal, getOrCreateCart } from "@/lib/cart";
import { confirmReservationForPayment, reserveInventory } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, getStripe, stripeEnabled } from "@/lib/stripe";
import { siteConfig } from "@/lib/site";
import { parseJsonArray, shippingCostForSubtotal, stripeCurrency } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const cart = await getOrCreateCart();
    if (!cart.items.length) {
      return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
    }

    const currency = stripeCurrency();
    const subtotal = cartSubtotal(cart);
    const shippingCost = shippingCostForSubtotal(subtotal);
    /**
     * Do NOT assume a flat Canadian sales tax (GST/HST/PST vary by province
     * and business registration). Prefer Stripe Tax when available; otherwise
     * taxAmount stays 0 on the order record and Stripe/checkout collects tax.
     */
    const taxAmount = 0;
    const total = subtotal + shippingCost + taxAmount;
    const orderNumber = `LLT-${nanoid(8).toUpperCase()}`;
    const country = String(body.country || siteConfig.defaultCountry || "CA")
      .trim()
      .toUpperCase()
      .slice(0, 2);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        email,
        status: "AWAITING_PAYMENT",
        currency: siteConfig.currency,
        subtotal,
        shippingCost,
        taxAmount,
        total,
        shippingName: body.name || null,
        shippingLine1: body.line1 || null,
        shippingLine2: body.line2 || null,
        shippingCity: body.city || null,
        shippingRegion: body.region || null,
        shippingPostal: body.postalCode || null,
        shippingCountry: country,
        isGift: Boolean(body.isGift),
        giftMessage: body.giftMessage || null,
        estimatedDelivery: null,
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            productName: item.variant.product.name,
            variantName: item.variant.packageSize,
            sku: item.variant.sku,
            unitPrice: item.variant.retailPrice,
            quantity: item.quantity,
            image: parseJsonArray(item.variant.product.images)[0] || null,
          })),
        },
        events: {
          create: { type: "created", payload: JSON.stringify({ source: "checkout" }) },
        },
      },
    });

    for (const item of cart.items) {
      await reserveInventory({
        variantId: item.variantId,
        quantity: item.quantity,
        cartId: cart.id,
        orderId: order.id,
        idempotencyKey: `reserve-${order.id}-${item.variantId}`,
      });
    }

    if (stripeEnabled()) {
      const stripe = getStripe()!;
      const baseParams = {
        mode: "payment" as const,
        customer_email: email,
        client_reference_id: order.id,
        success_url: absoluteUrl(`/order/${order.id}?success=1`),
        cancel_url: absoluteUrl("/checkout?cancelled=1"),
        line_items: cart.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency,
            unit_amount: item.variant.retailPrice,
            product_data: {
              name: item.variant.product.name,
              description: `${item.variant.product.teaType} · ${item.variant.packageSize}`,
            },
          },
        })),
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount" as const,
              fixed_amount: { amount: shippingCost, currency },
              display_name:
                shippingCost === 0 ? "Free shipping" : "Standard shipping",
            },
          },
        ],
        metadata: {
          orderId: order.id,
          orderNumber,
          currency: siteConfig.currency,
        },
        billing_address_collection: "auto" as const,
        phone_number_collection: { enabled: true },
      };

      let session;
      try {
        session = await stripe.checkout.sessions.create({
          ...baseParams,
          automatic_tax: { enabled: true },
        });
      } catch (taxError) {
        // Retry without automatic_tax if the Stripe account lacks Tax setup
        const msg =
          taxError instanceof Error ? taxError.message.toLowerCase() : "";
        if (/tax|automatic/i.test(msg)) {
          session = await stripe.checkout.sessions.create(baseParams);
        } else {
          throw taxError;
        }
      }

      await prisma.inventoryReservation.updateMany({
        where: { orderId: order.id, status: "ACTIVE" },
        data: { stripeSessionId: session.id },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id },
      });

      return NextResponse.json({
        mode: "stripe",
        url: session.url,
        orderId: order.id,
        orderNumber,
        currency: siteConfig.currency,
      });
    }

    // Demo checkout when Stripe keys are not configured
    const demoSessionId = `demo-${order.id}`;
    await prisma.inventoryReservation.updateMany({
      where: { orderId: order.id, status: "ACTIVE" },
      data: { stripeSessionId: demoSessionId },
    });

    await confirmReservationForPayment({
      stripeSessionId: demoSessionId,
      idempotencyKey: `pay-demo-${order.id}`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
        stripeSessionId: demoSessionId,
      },
    });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({
      mode: "demo",
      url: `/order/${order.id}?success=1`,
      orderId: order.id,
      orderNumber,
      currency: siteConfig.currency,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Checkout could not start",
      },
      { status: 400 },
    );
  }
}
