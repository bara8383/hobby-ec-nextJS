import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { UnauthorizedError, requireUserId } from '@/lib/chat/auth';
import { logChat } from '@/lib/chat/logger';
import { ensureSupportConversationForUser, getConversation, isParticipant } from '@/lib/chat/repository';
import { ackUserEvent, receiveUserEvent } from '@/lib/chat/queue';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const encoder = new TextEncoder();
const STREAM_MAX_MS = 15 * 60 * 1000;
const KEEP_ALIVE_MS = 15000;

function sseData(payload: unknown) {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
}


export async function GET(request: Request) {
  try {
    const userId = await requireUserId(request);
    const requestId = request.headers.get('x-request-id') ?? randomUUID();
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId')?.trim() ?? '';

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }

    const conversation =
      (await getConversation(conversationId)) ?? (await ensureSupportConversationForUser(userId, conversationId));
    if (!conversation || !isParticipant(conversation, userId)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const startedAt = Date.now();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(sseData({ type: 'connected', requestId, reconnectAfterMs: 1000 }));

        let lastKeepAlive = Date.now();

        while (!request.signal.aborted) {
          if (Date.now() - startedAt >= STREAM_MAX_MS) {
            controller.enqueue(sseData({ type: 'session.expiring', reason: 'max-duration' }));
            break;
          }

          const received = await receiveUserEvent(userId);
          if (request.signal.aborted) {
            break;
          }

          if (!received) {
            if (Date.now() - lastKeepAlive >= KEEP_ALIVE_MS) {
              controller.enqueue(encoder.encode(': keep-alive\n\n'));
              lastKeepAlive = Date.now();
            }
            continue;
          }

          if (received.event.conversationId !== conversationId) {
            await ackUserEvent(received.queueUrl, received.receiptHandle);
            continue;
          }

          controller.enqueue(sseData(received.event));
          await ackUserEvent(received.queueUrl, received.receiptHandle);
          lastKeepAlive = Date.now();

          logChat('event streamed', { requestId, userId, conversationId: received.event.conversationId });
        }

        controller.close();
      },
      cancel() {
        logChat('stream cancelled', { requestId, userId, conversationId });
      }
    });

    request.signal.addEventListener('abort', () => {
      logChat('stream aborted', { requestId, userId, conversationId });
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive'
      }
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    throw error;
  }
}
