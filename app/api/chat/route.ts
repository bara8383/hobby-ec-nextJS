import { randomUUID } from 'crypto';

const encoder = new TextEncoder();

type ChatMessage = {
  id: string;
  sender: 'user' | 'staff';
  text: string;
};

const messages: ChatMessage[] = [
  {
    id: randomUUID(),
    sender: 'staff',
    text: 'こんにちは！デジタル商品のライセンス・利用範囲の質問をどうぞ。'
  }
];

const listeners = new Set<(payload: ChatMessage[]) => void>();

function publish() {
  const payload = [...messages];
  listeners.forEach((notify) => notify(payload));
}

function sse(payload: ChatMessage[]) {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function GET() {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(sse(messages));

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
  const body = (await request.json()) as { text?: string };
  const text = body.text?.trim();

  if (!text) {
    return Response.json({ error: 'text is required' }, { status: 400 });
  }

  messages.push({ id: randomUUID(), sender: 'user', text });

  messages.push({
    id: randomUUID(),
    sender: 'staff',
    text: 'ありがとうございます。ライセンス条件と再ダウンロード手順をご案内します。'
  });

  if (messages.length > 20) {
    messages.splice(0, messages.length - 20);
  }

  publish();

  return Response.json({ ok: true }, { status: 201 });
}
