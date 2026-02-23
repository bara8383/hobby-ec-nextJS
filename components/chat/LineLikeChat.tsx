'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

type ConversationRead = {
  conversationId: string;
  userId: string;
  lastReadMessageId: string;
  updatedAt: string;
};

type ChatEvent =
  | {
      type: 'message.created';
      conversationId: string;
      message: Pick<Message, 'id' | 'senderId' | 'text' | 'createdAt'>;
    }
  | {
      type: 'conversation.read_updated';
      conversationId: string;
      userId: string;
      lastReadMessageId: string;
      updatedAt: string;
    };

const READ_DEBOUNCE_MS = 800;

type Props = {
  conversationId: string;
  currentUserId: string;
};

export function LineLikeChat({ conversationId, currentUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reads, setReads] = useState<ConversationRead[]>([]);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'connecting' | 'connected' | 'reconnecting'>('connecting');
  const listRef = useRef<HTMLDivElement | null>(null);
  const readDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const partnerRead = useMemo(
    () => reads.find((read) => read.userId !== currentUserId) ?? null,
    [reads, currentUserId]
  );

  const latestOwnMessageId = useMemo(() => {
    const reversed = [...messages].reverse();
    return reversed.find((message) => message.senderId === currentUserId)?.id ?? null;
  }, [messages, currentUserId]);

  const showReadBadge =
    partnerRead && latestOwnMessageId ? partnerRead.lastReadMessageId >= latestOwnMessageId : false;

  const reloadMessages = useCallback(async () => {
    // Reconnect補完はHTTPで最新状態を再取得する要件を採用（Last-Event-IDを使わない）。
    const response = await fetch(`/api/chat/conversations/${conversationId}/messages?limit=50`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as { messages: Message[]; reads: ConversationRead[] };
    setMessages(payload.messages);
    setReads(payload.reads ?? []);
  }, [conversationId]);

  useEffect(() => {
    let source: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = async () => {
      await fetch('/api/chat/session', { method: 'POST' });
      setStatus((current) => (current === 'connected' ? 'connected' : 'connecting'));
      source = new EventSource('/api/chat/events');

      source.addEventListener('open', async () => {
        setStatus('connected');
        await reloadMessages();
      });

      source.addEventListener('message.created', (event) => {
        const payload = JSON.parse(event.data) as ChatEvent;
        if (payload.type !== 'message.created' || payload.conversationId !== conversationId) {
          return;
        }

        setMessages((current) => {
          if (current.some((message) => message.id === payload.message.id)) {
            return current;
          }

          return [
            ...current,
            {
              id: payload.message.id,
              conversationId,
              senderId: payload.message.senderId,
              text: payload.message.text,
              createdAt: payload.message.createdAt
            }
          ];
        });
      });

      source.addEventListener('conversation.read_updated', (event) => {
        const payload = JSON.parse(event.data) as ChatEvent;
        if (payload.type !== 'conversation.read_updated' || payload.conversationId !== conversationId) {
          return;
        }

        setReads((current) => {
          const idx = current.findIndex((read) => read.userId === payload.userId);
          if (idx === -1) {
            return [...current, payload];
          }

          if (current[idx].lastReadMessageId >= payload.lastReadMessageId) {
            return current;
          }

          const next = [...current];
          next[idx] = payload;
          return next;
        });
      });

      source.addEventListener('error', () => {
        setStatus('reconnecting');
        source?.close();
        reconnectTimer = setTimeout(() => {
          void connect();
        }, 1000);
      });
    };

    void (async () => {
      await fetch('/api/chat/session', { method: 'POST' });
      await reloadMessages();
      await connect();
    })();

    return () => {
      source?.close();
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [conversationId, reloadMessages]);

  const postRead = useCallback(
    async (lastReadMessageId: string) => {
      await fetch(`/api/chat/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastReadMessageId })
      });
    },
    [conversationId]
  );

  const onScroll = useCallback(() => {
    const list = listRef.current;
    const lastMessage = messages[messages.length - 1];

    if (!list || !lastMessage) {
      return;
    }

    const threshold = 12;
    const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - threshold;
    if (!atBottom) {
      return;
    }

    if (readDebounceRef.current) {
      clearTimeout(readDebounceRef.current);
    }

    // 既読更新は最下部到達時のみ + debounceで連打抑制。
    readDebounceRef.current = setTimeout(() => {
      void postRead(lastMessage.id);
    }, READ_DEBOUNCE_MS);
  }, [messages, postRead]);

  async function onSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed })
    });

    if (!response.ok) {
      return;
    }

    setText('');
  }

  return (
    <section className="chat" aria-label="1対1チャット">
      <header>
        LINE風チャット <small className="connection-status">状態: {status}</small>
      </header>
      <div ref={listRef} className="chat-messages" onScroll={onScroll}>
        {/* React escapes plain text by default, which mitigates basic XSS for message rendering. */}
        {messages.map((message) => (
          <p key={message.id} className={`message ${message.senderId === currentUserId ? 'user' : 'staff'}`}>
            <strong>{message.senderId === currentUserId ? 'あなた' : '相手'}</strong>: {message.text}
          </p>
        ))}
      </div>
      {showReadBadge ? <p className="hero-label">既読</p> : null}
      <form onSubmit={onSend} className="chat-form">
        <Input value={text} onChange={(event) => setText(event.target.value)} maxLength={2000} />
        <Button type="submit" disabled={!text.trim()}>
          送信
        </Button>
      </form>
    </section>
  );
}
