import { InventoryStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { stockAvailable } from "@/lib/utils";
import { maybeCreateLowStockAlert } from "@/lib/notifications/low-stock";

const RESERVATION_MINUTES = 30;

function statusFromAvailable(available: number, reorderPoint: number): InventoryStatus {
  if (available <= 0) return "OUT_OF_STOCK";
  if (available <= reorderPoint) return "LOW_STOCK";
  return "IN_STOCK";
}

export async function reserveInventory(params: {
  variantId: string;
  quantity: number;
  cartId?: string;
  orderId?: string;
  stripeSessionId?: string;
  idempotencyKey?: string;
}) {
  const { variantId, quantity, cartId, orderId, stripeSessionId, idempotencyKey } = params;

  return prisma.$transaction(async (tx) => {
    if (idempotencyKey) {
      const existing = await tx.inventoryReservation.findUnique({
        where: { idempotencyKey },
      });
      if (existing) return existing;
    }

    const inventory = await tx.inventory.findUnique({ where: { variantId } });
    if (!inventory) throw new Error("Inventory record not found");

    const available = stockAvailable(inventory.stockOnHand, inventory.stockReserved);
    if (available < quantity) {
      throw new Error("Insufficient stock available");
    }

    const nextReserved = inventory.stockReserved + quantity;
    const nextAvailable = stockAvailable(inventory.stockOnHand, nextReserved);

    await tx.inventory.update({
      where: { id: inventory.id },
      data: {
        stockReserved: nextReserved,
        inventoryStatus: statusFromAvailable(nextAvailable, inventory.reorderPoint),
      },
    });

    await tx.inventoryTransaction.create({
      data: {
        inventoryId: inventory.id,
        type: "RESERVE",
        quantity,
        stockOnHandAfter: inventory.stockOnHand,
        stockReservedAfter: nextReserved,
        reason: "Checkout reservation",
        referenceType: orderId ? "order" : "cart",
        referenceId: orderId || cartId,
        idempotencyKey: idempotencyKey ? `txn-${idempotencyKey}` : undefined,
      },
    });

    const reservation = await tx.inventoryReservation.create({
      data: {
        variantId,
        cartId,
        orderId,
        quantity,
        stripeSessionId,
        idempotencyKey,
        expiresAt: new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000),
        status: "ACTIVE",
      },
    });

    return reservation;
  });
}

export async function releaseReservation(reservationId: string, reason = "Released") {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.inventoryReservation.findUnique({
      where: { id: reservationId },
    });
    if (!reservation || reservation.status !== "ACTIVE") return reservation;

    const inventory = await tx.inventory.findUnique({
      where: { variantId: reservation.variantId },
    });
    if (!inventory) return reservation;

    const nextReserved = Math.max(0, inventory.stockReserved - reservation.quantity);
    const nextAvailable = stockAvailable(inventory.stockOnHand, nextReserved);

    await tx.inventory.update({
      where: { id: inventory.id },
      data: {
        stockReserved: nextReserved,
        inventoryStatus: statusFromAvailable(nextAvailable, inventory.reorderPoint),
      },
    });

    await tx.inventoryTransaction.create({
      data: {
        inventoryId: inventory.id,
        type: "RELEASE",
        quantity: reservation.quantity,
        stockOnHandAfter: inventory.stockOnHand,
        stockReservedAfter: nextReserved,
        reason,
        referenceType: "reservation",
        referenceId: reservation.id,
        idempotencyKey: `release-${reservation.id}`,
      },
    });

    return tx.inventoryReservation.update({
      where: { id: reservation.id },
      data: { status: "RELEASED" },
    });
  });
}

export async function confirmReservationForPayment(params: {
  stripeSessionId: string;
  idempotencyKey: string;
}) {
  const { stripeSessionId, idempotencyKey } = params;

  return prisma.$transaction(async (tx) => {
    const existingTxn = await tx.inventoryTransaction.findUnique({
      where: { idempotencyKey },
    });
    if (existingTxn) {
      return { alreadyProcessed: true as const };
    }

    const reservations = await tx.inventoryReservation.findMany({
      where: { stripeSessionId, status: "ACTIVE" },
    });

    for (const reservation of reservations) {
      const inventory = await tx.inventory.findUnique({
        where: { variantId: reservation.variantId },
      });
      if (!inventory) continue;

      const nextOnHand = Math.max(0, inventory.stockOnHand - reservation.quantity);
      const nextReserved = Math.max(0, inventory.stockReserved - reservation.quantity);
      const nextAvailable = stockAvailable(nextOnHand, nextReserved);

      await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          stockOnHand: nextOnHand,
          stockReserved: nextReserved,
          inventoryStatus: statusFromAvailable(nextAvailable, inventory.reorderPoint),
        },
      });

      await tx.inventoryTransaction.create({
        data: {
          inventoryId: inventory.id,
          type: "SALE_CONFIRM",
          quantity: reservation.quantity,
          stockOnHandAfter: nextOnHand,
          stockReservedAfter: nextReserved,
          reason: "Payment confirmed",
          referenceType: "stripe_session",
          referenceId: stripeSessionId,
          idempotencyKey:
            reservations.length === 1
              ? idempotencyKey
              : `${idempotencyKey}-${reservation.id}`,
        },
      });

      await tx.inventoryReservation.update({
        where: { id: reservation.id },
        data: { status: "CONFIRMED" },
      });
    }

    return { alreadyProcessed: false as const, count: reservations.length };
  }).then(async (result) => {
    // Low-stock checks outside the payment transaction
    const reservations = await prisma.inventoryReservation.findMany({
      where: { stripeSessionId, status: "CONFIRMED" },
      include: { variant: { include: { inventory: true, product: true } } },
    });
    for (const r of reservations) {
      if (r.variant.inventory) {
        await maybeCreateLowStockAlert(r.variant.id);
      }
    }
    return result;
  });
}

export async function adjustInventory(params: {
  variantId: string;
  deltaOnHand: number;
  reason: string;
  actorId?: string;
  idempotencyKey?: string;
}) {
  const { variantId, deltaOnHand, reason, actorId, idempotencyKey } = params;

  return prisma.$transaction(async (tx) => {
    if (idempotencyKey) {
      const existing = await tx.inventoryTransaction.findUnique({
        where: { idempotencyKey },
      });
      if (existing) return existing;
    }

    const inventory = await tx.inventory.findUnique({ where: { variantId } });
    if (!inventory) throw new Error("Inventory not found");

    const nextOnHand = inventory.stockOnHand + deltaOnHand;
    if (nextOnHand < 0) throw new Error("Adjustment would make stock negative");

    const nextAvailable = stockAvailable(nextOnHand, inventory.stockReserved);

    const updated = await tx.inventory.update({
      where: { id: inventory.id },
      data: {
        stockOnHand: nextOnHand,
        inventoryStatus: statusFromAvailable(nextAvailable, inventory.reorderPoint),
        lastRestockedAt: deltaOnHand > 0 ? new Date() : inventory.lastRestockedAt,
      },
    });

    const txn = await tx.inventoryTransaction.create({
      data: {
        inventoryId: inventory.id,
        type: deltaOnHand >= 0 ? "ADJUST_IN" : "ADJUST_OUT",
        quantity: Math.abs(deltaOnHand),
        stockOnHandAfter: updated.stockOnHand,
        stockReservedAfter: updated.stockReserved,
        reason,
        createdById: actorId,
        idempotencyKey,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId,
        action: "INVENTORY_ADJUST",
        entityType: "Inventory",
        entityId: inventory.id,
        before: JSON.stringify({ stockOnHand: inventory.stockOnHand }),
        after: JSON.stringify({ stockOnHand: updated.stockOnHand, reason }),
      },
    });

    return txn;
  }).then(async (txn) => {
    await maybeCreateLowStockAlert(variantId);
    return txn;
  });
}

export async function expireStaleReservations() {
  const stale = await prisma.inventoryReservation.findMany({
    where: { status: "ACTIVE", expiresAt: { lt: new Date() } },
  });
  for (const reservation of stale) {
    await releaseReservation(reservation.id, "Reservation expired");
    await prisma.inventoryReservation.update({
      where: { id: reservation.id },
      data: { status: "EXPIRED" },
    });
  }
  return stale.length;
}

export type InventoryWithRelations = Prisma.InventoryGetPayload<{
  include: { variant: { include: { product: true } }; supplier: true };
}>;
