import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { adjustInventory } from "@/lib/inventory";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supplierId = String(body.supplierId || "");
    const items = Array.isArray(body.items) ? body.items : [];
    const alertIds: string[] = Array.isArray(body.alertIds) ? body.alertIds : [];

    if (!supplierId || !items.length) {
      return NextResponse.json({ error: "Invalid PO payload" }, { status: 400 });
    }

    let totalCost = 0;
    const lineData = [];
    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
      });
      if (!variant) continue;
      const unitCost = variant.unitCost || 0;
      const quantity = Number(item.quantity || 0);
      totalCost += unitCost * quantity;
      lineData.push({
        variantId: variant.id,
        sku: variant.sku,
        quantity,
        unitCost,
      });
    }

    const po = await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${nanoid(6).toUpperCase()}`,
        supplierId,
        status: "ORDERED",
        totalCost,
        expectedArrival: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        items: { create: lineData },
      },
      include: { items: true },
    });

    if (alertIds.length) {
      await prisma.stockAlert.updateMany({
        where: { id: { in: alertIds } },
        data: { status: "REORDER_SENT" },
      });
    }

    for (const item of po.items) {
      await prisma.inventory.updateMany({
        where: { variantId: item.variantId },
        data: { incomingStock: { increment: item.quantity } },
      });
    }

    return NextResponse.json({ po });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PO failed" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const poId = String(body.poId || "");
    if (!poId) return NextResponse.json({ error: "poId required" }, { status: 400 });

    const po = await prisma.purchaseOrder.findUnique({
      where: { id: poId },
      include: { items: true },
    });
    if (!po) return NextResponse.json({ error: "Not found" }, { status: 404 });

    for (const item of po.items) {
      const remaining = item.quantity - item.quantityReceived;
      if (remaining <= 0) continue;
      await adjustInventory({
        variantId: item.variantId,
        deltaOnHand: remaining,
        reason: `PO ${po.poNumber} received`,
        idempotencyKey: `po-receive-${po.id}-${item.id}`,
      });
      await prisma.purchaseOrderItem.update({
        where: { id: item.id },
        data: { quantityReceived: item.quantity },
      });
      await prisma.inventory.updateMany({
        where: { variantId: item.variantId },
        data: { incomingStock: { decrement: remaining } },
      });
    }

    const updated = await prisma.purchaseOrder.update({
      where: { id: poId },
      data: { status: "RECEIVED" },
    });

    await prisma.stockAlert.updateMany({
      where: {
        variantId: { in: po.items.map((i) => i.variantId) },
        status: { in: ["OPEN", "REORDER_SENT"] },
      },
      data: { status: "RESOLVED", resolvedAt: new Date() },
    });

    return NextResponse.json({ po: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Receive failed" },
      { status: 400 },
    );
  }
}
