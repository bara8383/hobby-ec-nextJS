import { NextResponse } from "next/server";
import { addMessage, listMessages } from "@/lib/chatStore";

export async function GET() {
  return NextResponse.json({ messages: listMessages() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { text?: string };
  const text = String(body.text ?? "").trim();

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  addMessage("guest", text);
  return NextResponse.json({ ok: true });
}
