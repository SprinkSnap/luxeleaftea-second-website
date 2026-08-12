import { NotificationChannel, NotificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type SupplierReorderPayload = {
  productName: string;
  sku: string;
  stockAvailable: number;
  reorderPoint: number;
  suggestedReorder: number;
  supplierName: string;
  inventoryUrl: string;
  createPoUrl: string;
};

export function formatReorderMessage(payload: SupplierReorderPayload) {
  return [
    "Lux Leaf Tea — Reorder Alert",
    "",
    `Product: ${payload.productName}`,
    `SKU: ${payload.sku}`,
    `Available Stock: ${payload.stockAvailable}`,
    `Reorder Threshold: ${payload.reorderPoint}`,
    `Suggested Reorder: ${payload.suggestedReorder} units`,
    `Supplier: ${payload.supplierName}`,
    "",
    `View Inventory: ${payload.inventoryUrl}`,
    `Create Purchase Order: ${payload.createPoUrl}`,
    "Mark Reorder Sent: update alert status in admin",
  ].join("\n");
}

async function sendEmail(recipient: string, subject: string, body: string) {
  // Merchant configures EMAIL_PROVIDER + credentials. Log for local/dev.
  if (process.env.EMAIL_WEBHOOK_URL) {
    const res = await fetch(process.env.EMAIL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: recipient, subject, text: body }),
    });
    if (!res.ok) throw new Error(`Email webhook failed: ${res.status}`);
    return;
  }
  console.info("[email:dev]", { recipient, subject, body });
}

async function sendSlack(body: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.info("[slack:dev]", body);
    return;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: body }),
  });
  if (!res.ok) throw new Error(`Slack webhook failed: ${res.status}`);
}

async function sendWeCom(body: string, webhook?: string | null) {
  const url = webhook || process.env.WECOM_WEBHOOK_URL;
  if (!url) {
    console.info("[wecom:dev]", body);
    return;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ msgtype: "text", text: { content: body } }),
  });
  if (!res.ok) throw new Error(`WeCom webhook failed: ${res.status}`);
}

async function sendSms(recipient: string, body: string) {
  if (process.env.SMS_WEBHOOK_URL) {
    const res = await fetch(process.env.SMS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: recipient, text: body }),
    });
    if (!res.ok) throw new Error(`SMS webhook failed: ${res.status}`);
    return;
  }
  console.info("[sms:dev]", { recipient, body });
}

export async function sendSupplierReorderNotification(params: {
  channel?: NotificationChannel;
  recipient: string;
  payload: SupplierReorderPayload;
  wecomWebhook?: string | null;
  maxAttempts?: number;
}) {
  const channel = params.channel || (process.env.REORDER_NOTIFY_CHANNEL as NotificationChannel) || "EMAIL";
  const subject = "Lux Leaf Tea — Reorder Alert";
  const body = formatReorderMessage(params.payload);
  const maxAttempts = params.maxAttempts ?? 3;

  const log = await prisma.notificationLog.create({
    data: {
      channel,
      recipient: params.recipient,
      subject,
      body,
      status: "PENDING",
      metadata: JSON.stringify(params.payload),
    },
  });

  let attempts = 0;
  let lastError: string | undefined;
  let status: NotificationStatus = "PENDING";

  while (attempts < maxAttempts) {
    attempts += 1;
    try {
      if (channel === "EMAIL") await sendEmail(params.recipient, subject, body);
      else if (channel === "SLACK") await sendSlack(body);
      else if (channel === "WECOM") await sendWeCom(body, params.wecomWebhook);
      else if (channel === "SMS") await sendSms(params.recipient, body);
      else await sendEmail(params.recipient, subject, body);

      status = "SENT";
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Unknown error";
      status = attempts < maxAttempts ? "RETRYING" : "FAILED";
      await prisma.notificationLog.update({
        where: { id: log.id },
        data: { attempts, status, lastError },
      });
      await new Promise((r) => setTimeout(r, 250 * attempts));
    }
  }

  return prisma.notificationLog.update({
    where: { id: log.id },
    data: {
      attempts,
      status,
      lastError,
      sentAt: status === "SENT" ? new Date() : null,
    },
  });
}
