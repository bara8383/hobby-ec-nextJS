import { NextResponse } from 'next/server';
import { maybeExtendSessionCookie, requireUser } from '@/lib/chat/core/session';
import { CsrfError, ForbiddenAsNotFoundError, UnauthorizedError, assertSameOrigin } from '@/lib/chat/core/security';
import { hitRateLimit } from '@/lib/chat/core/rate-limit';
import { createMessage, findConversation, isParticipant, listMessages, listReads, participants } from '@/lib/chat/core/store';
import { publish } from '@/lib/chat/core/sse';

export const runtime = 'nodejs';

type Params = { params: Promise<{ conversationId: string }> };

function assertConversationAccess(conversationId: string, userId: string) {
  const conversation = findConversation(conversationId);
  if (!conversation || !isParticipant(conversation, userId)) {
    // Authz is intentionally hidden as 404 to avoid leaking conversation existence.
    // Operationally, keep detailed reason/user/conversation in server logs for audits.
    throw new ForbiddenAsNotFoundError('conversation_hidden');
  }
  return conversation;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const session = requireUser(request);
    await maybeExtendSessionCookie(session.sessionId);
    const { conversationId } = await params;
    const conversation = assertConversationAccess(conversationId, session.userId);

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limitRaw = Number(searchParams.get('limit') ?? '50');
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 50;
    const page = listMessages(conversation.id, cursor, limit);

    return NextResponse.json({ ...page, reads: listReads(conversation.id) });
  } catch (error) {
    if (error instanceof UnauthorizedError) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenAsNotFoundError) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    assertSameOrigin(request);
    const session = requireUser(request);
    await maybeExtendSessionCookie(session.sessionId);

    if (hitRateLimit(`msg:${session.userId}`, 30)) {
      return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
    }

    const { conversationId } = await params;
    const conversation = assertConversationAccess(conversationId, session.userId);
    const body = (await request.json()) as { text?: unknown };
    const text = typeof body.text === 'string' ? body.text.trim() : '';

    if (!text || text.length > 2000) {
      return NextResponse.json({ error: 'validation_error' }, { status: 422 });
    }

    const message = createMessage(conversation.id, session.userId, text);
    if (!message) throw new ForbiddenAsNotFoundError('conversation_hidden');

    const event = {
      type: 'message.created' as const,
      conversationId: conversation.id,
      message: { id: message.id, senderId: message.senderId, text: message.text, createdAt: message.createdAt }
    };

    for (const userId of participants(conversation)) publish(userId, event);

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenAsNotFoundError) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    if (error instanceof CsrfError) return NextResponse.json({ error: 'csrf_failed' }, { status: 422 });
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}
