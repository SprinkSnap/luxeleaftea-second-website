import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const variantId = String(body.variantId || "");
  const consent = Boolean(body.consent);

  if (!email.includes("@") || !variantId || !consent) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.backInStockSubscription.upsert({
    where: { variantId_email: { variantId, email } },
    create: { variantId, email, consent: true },
    update: { consent: true, notified: false },
  });

  return NextResponse.json({ ok: true });
}
