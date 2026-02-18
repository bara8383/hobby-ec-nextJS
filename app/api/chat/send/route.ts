import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { UnauthorizedError, requireUserId } from '@/lib/chat/auth';
import { logChat } from '@/lib/chat/logger';
import {
  createMessageWithIdempotency,
  ensureSupportConversationForUser,
  getConversation,
  isParticipant
} from '@/lib/chat/repository';
import { enqueueUserEvent } from '@/lib/chat/queue';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const userId = await requireUserId(request);
    const requestId = request.headers.get('x-request-id') ?? randomUUID();
    const body = (await request.json()) as {
      conversationId?: string;
      body?: string;
      idempotencyKey?: string;
    };

    const conversationId = body.conversationId?.trim() ?? '';
    const messageBody = body.body?.trim() ?? '';
    const idempotencyKey =
      request.headers.get('idempotency-key')?.trim() ?? body.idempotencyKey?.trim() ?? requestId;

    if (!conversationId || !messageBody) {
      return NextResponse.json({ error: 'conversationId and body are required' }, { status: 400 });
    }

    const conversation =
      (await getConversation(conversationId)) ?? (await ensureSupportConversationForUser(userId, conversationId));

    if (!isParticipant(conversation, userId)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const messageId = await createMessageWithIdempotency({
      conversationId,
      senderId: userId,
      body: messageBody,
      idempotencyKey
    });

    const now = new Date().toISOString();
    const receivers = conversation.participants.filter((participantId) => participantId !== userId);

    await Promise.all(
      receivers.map((receiverId) =>
        enqueueUserEvent(receiverId, {
          type: 'message.created',
          conversationId,
          messageId,
          createdAt: now,
          requestId
        })
      )
    );

    logChat('message sent', { requestId, userId, conversationId });

    return NextResponse.json({ messageId }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    throw error;
  }
}
