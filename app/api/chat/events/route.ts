import { NextResponse } from 'next/server';
import { ChatAuthError, requireSessionUserId } from '@/lib/chat/server-auth';
import { subscribeUserEvents } from '@/lib/chat/sse-broker';
import type { ChatEvent } from '@/lib/chat/realtime-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const encoder = new TextEncoder();

function encodeEvent(event: ChatEvent) {
  return encoder.encode(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
}

export async function GET(request: Request) {
  try {
    const userId = requireSessionUserId(request);

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const unsubscribe = subscribeUserEvents(userId, (event) => {
          controller.enqueue(encodeEvent(event));
        });

        const pingTimer = setInterval(() => {
          controller.enqueue(encoder.encode(': ping\n\n'));
        }, 15000);

        request.signal.addEventListener('abort', () => {
          clearInterval(pingTimer);
          unsubscribe();
          controller.close();
        });
      },
      cancel() {
        // Cleanup is handled by request abort listener above.
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive'
      }
    });
  } catch (error) {
    if (error instanceof ChatAuthError) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}
