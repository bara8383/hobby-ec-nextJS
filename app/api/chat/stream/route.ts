import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { UnauthorizedError, requireUserId } from '@/lib/chat/auth';
import { logChat } from '@/lib/chat/logger';
import { ackUserEvent, receiveUserEvent } from '@/lib/chat/queue';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const encoder = new TextEncoder();

function eventMessage(payload: unknown) {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function GET(request: Request) {
  try {
    const userId = await requireUserId(request);
    const requestId = request.headers.get('x-request-id') ?? randomUUID();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(eventMessage({ type: 'connected', requestId }));

        while (!request.signal.aborted) {
          const received = await receiveUserEvent(userId);

          if (!received) {
            controller.enqueue(encoder.encode(': keep-alive\n\n'));
            continue;
          }

          controller.enqueue(eventMessage(received.event));
          await ackUserEvent(received.queueUrl, received.receiptHandle);

          logChat('event streamed', {
            requestId,
            userId,
            conversationId: received.event.conversationId
          });
        }

        controller.close();
      },
      cancel() {
        logChat('stream cancelled', { requestId, userId, conversationId: undefined });
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
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
