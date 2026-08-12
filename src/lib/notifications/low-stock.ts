import { prisma } from "@/lib/prisma";
import { stockAvailable } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { sendSupplierReorderNotification } from "@/lib/notifications/provider";

export async function maybeCreateLowStockAlert(variantId: string) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: {
      product: true,
      inventory: { include: { supplier: true } },
    },
  });

  if (!variant?.inventory) return null;
  const inventory = variant.inventory;
  const available = stockAvailable(inventory.stockOnHand, inventory.stockReserved);

  if (available > inventory.reorderPoint) {
    // Resolve open alerts when stock recovers
    await prisma.stockAlert.updateMany({
      where: { variantId, status: { in: ["OPEN", "REORDER_SENT"] } },
      data: { status: "RESOLVED", resolvedAt: new Date() },
    });
    return null;
  }

  const existing = await prisma.stockAlert.findFirst({
    where: { variantId, status: { in: ["OPEN", "REORDER_SENT"] } },
  });
  if (existing) return existing;

  const alert = await prisma.stockAlert.create({
    data: {
      variantId,
      supplierId: inventory.supplierId,
      sku: variant.sku,
      productName: variant.product.name,
      stockAvailable: available,
      reorderPoint: inventory.reorderPoint,
      suggestedReorderQty: inventory.reorderQuantity,
      status: "OPEN",
    },
  });

  const supplier = inventory.supplier;
  const recipient =
    supplier?.email ||
    process.env.INVENTORY_ALERT_EMAIL ||
    siteConfig.supportEmail;

  const notification = await sendSupplierReorderNotification({
    recipient,
    wecomWebhook: supplier?.wecomWebhook,
    payload: {
      productName: variant.product.name,
      sku: variant.sku,
      stockAvailable: available,
      reorderPoint: inventory.reorderPoint,
      suggestedReorder: inventory.reorderQuantity,
      supplierName: supplier?.name || "Unassigned supplier",
      inventoryUrl: `${siteConfig.url}/admin/inventory`,
      createPoUrl: `${siteConfig.url}/admin/purchase-orders`,
    },
  });

  return prisma.stockAlert.update({
    where: { id: alert.id },
    data: { notificationId: notification.id },
  });
}
