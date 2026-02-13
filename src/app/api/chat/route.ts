import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { errorResponse } from "@/lib/apiError";
import { addMessage, listMessages } from "@/lib/chatStore";

export async function GET() {
  return NextResponse.json({ messages: listMessages() });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: string };
    const text = String(body.text ?? "").trim();

    if (!text) {
      return errorResponse(400, "VALIDATION_ERROR", "text is required");
    }

    addMessage("guest", text);
    return NextResponse.json({ ok: true });
  } catch {
    return errorResponse(500, "INTERNAL_SERVER_ERROR", "failed to process chat request");
  }
}
