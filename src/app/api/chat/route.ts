import { NextResponse } from "next/server";
import { answerShoppingAssistant } from "@/lib/ai/assistant";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = String(body.message || "").trim();
    const conversationId = body.conversationId as string | undefined;
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    let conversation = conversationId
      ? await prisma.chatConversation.findUnique({ where: { id: conversationId } })
      : null;

    if (!conversation) {
      conversation = await prisma.chatConversation.create({ data: {} });
    }

    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message,
      },
    });

    const result = await answerShoppingAssistant(message);

    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: result.reply,
        productIds: JSON.stringify(result.products.map((p) => p.id)),
      },
    });

    return NextResponse.json({
      conversationId: conversation.id,
      reply: result.reply,
      products: result.products,
      identity:
        "AI shopping assistant — recommendations are limited to Lux Leaf Tea catalog data.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Assistant unavailable",
      },
      { status: 503 },
    );
  }
}
