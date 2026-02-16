import { appendChatMessage, listChatMessages, type ChatMessage } from '@/lib/chat/store';

const encoder = new TextEncoder();

const listeners = new Set<(payload: ChatMessage[]) => void>();
const postLimiter = new Map<string, number>();

function publish(payload: ChatMessage[]) {
  listeners.forEach((notify) => notify(payload));
}

function sse(payload: ChatMessage[]) {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function GET() {
  const initial = await listChatMessages();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(sse(initial));

      const listener = (payload: ChatMessage[]) => {
        controller.enqueue(sse(payload));
      };

      listeners.add(listener);

      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(': keep-alive\n\n'));
      }, 15000);

      return () => {
        clearInterval(keepAlive);
        listeners.delete(listener);
      };
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    }
  });
}

export async function POST(request: Request) {
  const clientKey = request.headers.get('x-forwarded-for') ?? 'local';
  const now = Date.now();
  const previous = postLimiter.get(clientKey) ?? 0;

  if (now - previous < 800) {
    return Response.json({ error: 'too many requests' }, { status: 429 });
  }

  postLimiter.set(clientKey, now);

  const body = (await request.json()) as { text?: string };
  const text = body.text?.trim();

  if (!text) {
    return Response.json({ error: 'text is required' }, { status: 400 });
  }

  await appendChatMessage({ sender: 'user', text });
  await appendChatMessage({
    sender: 'staff',
    text: 'ありがとうございます。ライセンス条件と再ダウンロード手順をご案内します。'
  });

  const payload = await listChatMessages();
  publish(payload);

  return Response.json({ ok: true }, { status: 201 });
}
