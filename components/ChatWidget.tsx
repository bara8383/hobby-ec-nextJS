'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type ChatMessage = {
  messageId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

type StreamEvent =
  | {
      type: 'connected';
      requestId: string;
    }
  | {
      type: 'message.created';
      conversationId: string;
      messageId: string;
      createdAt: string;
      requestId: string;
    };

const maxRetryMs = 10000;

type ChatWidgetProps = {
  initialMessage?: string;
  conversationId: string;
  currentUserId: string;
};

export function ChatWidget({ initialMessage, conversationId, currentUserId }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [connection, setConnection] = useState<'connecting' | 'connected' | 'reconnecting'>('connecting');
  const [postError, setPostError] = useState<string | null>(null);
  const retryCountRef = useRef(0);

  const reloadHistory = useCallback(async () => {
    const response = await fetch(`/api/chat/history?conversationId=${conversationId}&limit=20`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as { messages: ChatMessage[] };
    setMessages(payload.messages);
  }, [conversationId]);

  useEffect(() => {
    if (initialMessage?.trim()) {
      setText(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    let source: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      setConnection((status) => (status === 'connected' ? 'connected' : 'connecting'));
      source = new EventSource(`/api/chat/stream?conversationId=${conversationId}`);

      source.onopen = async () => {
        retryCountRef.current = 0;
        setConnection('connected');
        await reloadHistory();
      };

      source.onmessage = async (event) => {
        const payload = JSON.parse(event.data) as StreamEvent;
        if (payload.type !== 'message.created' || payload.conversationId !== conversationId) {
          return;
        }

        await reloadHistory();
      };

      source.onerror = () => {
        setConnection('reconnecting');
        source?.close();
        const nextRetry = Math.min(1000 * 2 ** retryCountRef.current, maxRetryMs);
        retryCountRef.current += 1;
        retryTimer = setTimeout(connect, nextRetry);
      };
    };

    void reloadHistory();
    connect();

    return () => {
      source?.close();
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
    };
  }, [conversationId, reloadHistory]);

  const disabled = useMemo(() => text.trim().length === 0, [text]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setPostError(null);

    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': crypto.randomUUID(),
        'Idempotency-Key': crypto.randomUUID()
      },
      body: JSON.stringify({
        conversationId,
        body: trimmed
      })
    });

    if (!response.ok) {
      setPostError('メッセージ送信に失敗しました。時間をおいて再試行してください。');
      return;
    }

    setText('');
    await reloadHistory();
  }

  return (
    <section className="chat" aria-label="リアルタイムチャット">
      <header>
        チャット
        <small className="connection-status">状態: {connection}</small>
      </header>
      <div className="chat-messages">
        {messages.map((message) => (
          <p key={message.messageId} className={`message ${message.senderId === currentUserId ? 'user' : 'staff'}`}>
            <strong>{message.senderId === currentUserId ? 'あなた' : message.senderId}</strong>: {message.body}
          </p>
        ))}
      </div>
      <form onSubmit={onSubmit} className="chat-form">
        <Input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="丁寧な言葉で相談内容を送信してください"
          aria-label="メッセージ"
        />
        <Button type="submit" disabled={disabled}>
          送信
        </Button>
      </form>
      {postError ? (
        <p className="chat-error" role="alert">
          {postError}
        </p>
      ) : null}
    </section>
  );
}
