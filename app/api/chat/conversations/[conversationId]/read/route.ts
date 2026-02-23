import { NextResponse } from 'next/server';
import {
  findMessage,
  getConversation,
  isParticipant,
  listParticipants,
  updateConversationReadProgress
} from '@/lib/chat/in-memory-chat-store';
import { publishUserEvent } from '@/lib/chat/sse-broker';
import { ChatAuthError, requireSessionUserId } from '@/lib/chat/server-auth';

export const runtime = 'nodejs';

type Params = { params: Promise<{ conversationId: string }> };

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

    const body = (await request.json()) as { lastReadMessageId?: string };
    const lastReadMessageId = body.lastReadMessageId?.trim() ?? '';

    if (!lastReadMessageId) {
      return NextResponse.json({ error: 'lastReadMessageId is required' }, { status: 422 });
    }

    const message = findMessage(conversationId, lastReadMessageId);
    if (!message) {
      return NextResponse.json({ error: 'message_not_found' }, { status: 422 });
    }

    const result = updateConversationReadProgress(conversationId, userId, lastReadMessageId);

    const event = {
      type: 'conversation.read_updated' as const,
      conversationId,
      userId,
      lastReadMessageId: result.record.lastReadMessageId,
      updatedAt: result.record.updatedAt
    };

    for (const participantId of listParticipants(conversation)) {
      publishUserEvent(participantId, event);
    }

    return NextResponse.json({ read: result.record, changed: result.changed });
  } catch (error) {
    if (error instanceof ChatAuthError) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}
