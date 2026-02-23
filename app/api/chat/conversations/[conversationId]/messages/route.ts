import { NextResponse } from 'next/server';
import {
  createMessage,
  getConversation,
  isParticipant,
  listMessages,
  listParticipants,
  listConversationReads
} from '@/lib/chat/in-memory-chat-store';
import { publishUserEvent } from '@/lib/chat/sse-broker';
import { ChatAuthError, requireSessionUserId } from '@/lib/chat/server-auth';

export const runtime = 'nodejs';

type Params = { params: Promise<{ conversationId: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const userId = requireSessionUserId(request);
    const { conversationId } = await params;
    const conversation = getConversation(conversationId);

    if (!conversation) {
      return NextResponse.json({ error: 'conversation_not_found' }, { status: 404 });
    }

    if (!isParticipant(conversation, userId)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limitRaw = Number(searchParams.get('limit') ?? '50');
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 50;

    const page = listMessages(conversationId, cursor, limit);
    const reads = listConversationReads(conversationId);

    return NextResponse.json({ ...page, reads });
  } catch (error) {
    if (error instanceof ChatAuthError) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const userId = requireSessionUserId(request);
    const { conversationId } = await params;
    const conversation = getConversation(conversationId);

    if (!conversation) {
      return NextResponse.json({ error: 'conversation_not_found' }, { status: 404 });
    }

    if (!isParticipant(conversation, userId)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    // CSRF hardening can be added later by validating Origin/CSRF token on state-changing requests.
    const body = (await request.json()) as { text?: string };
    const text = body.text?.trim() ?? '';

    if (!text || text.length > 2000) {
      return NextResponse.json({ error: 'text must be 1-2000 chars' }, { status: 422 });
    }

    const message = createMessage(conversationId, userId, text);
    if (!message) {
      return NextResponse.json({ error: 'conversation_not_found' }, { status: 404 });
    }

    const event = {
      type: 'message.created' as const,
      conversationId,
      message: {
        id: message.id,
        senderId: message.senderId,
        text: message.text,
        createdAt: message.createdAt
      }
    };

    // Single SSE stream per user: fan out conversation events to each participant.
    for (const participantId of listParticipants(conversation)) {
      publishUserEvent(participantId, event);
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    if (error instanceof ChatAuthError) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}
