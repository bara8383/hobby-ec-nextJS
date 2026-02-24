import { NextResponse } from 'next/server';
import { maybeExtendSessionCookie, requireUser } from '@/lib/chat/core/session';
import { subscribe } from '@/lib/chat/core/sse';
import type { ChatEvent } from '@/lib/chat/core/types';
import { UnauthorizedError } from '@/lib/chat/core/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const encoder = new TextEncoder();

function encode(event: ChatEvent) {
  return encoder.encode(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
}

export async function GET(request: Request) {
  try {
    const session = requireUser(request);
    await maybeExtendSessionCookie(session.sessionId);

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const unsubscribe = subscribe(session.userId, (event) => controller.enqueue(encode(event)));
        const pingTimer = setInterval(() => controller.enqueue(encoder.encode(': ping\n\n')), 15000);

        request.signal.addEventListener('abort', () => {
          clearInterval(pingTimer);
          unsubscribe();
          controller.close();
        });
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
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}
