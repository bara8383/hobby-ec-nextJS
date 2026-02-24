import { NextResponse } from 'next/server';
import { maybeExtendSessionCookie, requireUser } from '@/lib/chat/core/session';
import { CsrfError, ForbiddenAsNotFoundError, UnauthorizedError, assertSameOrigin } from '@/lib/chat/core/security';
import { hitRateLimit } from '@/lib/chat/core/rate-limit';
import { findConversation, findMessage, isParticipant, participants, updateReadProgress } from '@/lib/chat/core/store';
import { publish } from '@/lib/chat/core/sse';

export const runtime = 'nodejs';

type Params = { params: Promise<{ conversationId: string }> };

function assertConversationAccess(conversationId: string, userId: string) {
  const conversation = findConversation(conversationId);
  if (!conversation || !isParticipant(conversation, userId)) {
    throw new ForbiddenAsNotFoundError('conversation_hidden');
  }
  return conversation;
}

export async function POST(request: Request, { params }: Params) {
  try {
    assertSameOrigin(request);
    const session = requireUser(request);
    await maybeExtendSessionCookie(session.sessionId);

    if (hitRateLimit(`read:${session.userId}`, 60)) {
      return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
    }

    const { conversationId } = await params;
    const conversation = assertConversationAccess(conversationId, session.userId);
    const body = (await request.json()) as { lastReadMessageId?: unknown };
    const lastReadMessageId = typeof body.lastReadMessageId === 'string' ? body.lastReadMessageId : '';

    if (!lastReadMessageId) return NextResponse.json({ error: 'validation_error' }, { status: 422 });

    const targetMessage = findMessage(conversation.id, lastReadMessageId);
    if (!targetMessage) return NextResponse.json({ error: 'validation_error' }, { status: 422 });

    const result = updateReadProgress(conversation.id, session.userId, lastReadMessageId);

    if (result.changed) {
      const event = {
        type: 'conversation.read_updated' as const,
        conversationId: conversation.id,
        userId: session.userId,
        lastReadMessageId: result.record.lastReadMessageId,
        updatedAt: result.record.updatedAt
      };

      for (const userId of participants(conversation)) publish(userId, event);
    }

    return NextResponse.json({ read: result.record, changed: result.changed });
  } catch (error) {
    if (error instanceof UnauthorizedError) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenAsNotFoundError) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    if (error instanceof CsrfError) return NextResponse.json({ error: 'csrf_failed' }, { status: 422 });
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}
