import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const consent = Boolean(body.consent);
  if (!email.includes("@") || !consent) {
    return NextResponse.json(
      { error: "Email and consent are required" },
      { status: 400 },
    );
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, consent, source: "website" },
    update: { consent: true },
  });

  return NextResponse.json({ ok: true });
}
