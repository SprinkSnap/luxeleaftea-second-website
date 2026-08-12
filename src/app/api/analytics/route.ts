import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "");
    if (!name) return NextResponse.json({ ok: false }, { status: 400 });

    await prisma.analyticsEvent.create({
      data: {
        name,
        payload: JSON.stringify(body.payload || {}),
        sessionId: body.sessionId || null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
