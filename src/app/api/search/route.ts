import { NextResponse } from "next/server";
import { searchAll } from "@/lib/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const results = await searchAll(q);
  return NextResponse.json(results);
}
