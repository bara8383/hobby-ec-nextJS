'use client';

import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

type ChatEventMessageCreated = {
  conversationId: string;
  message: Pick<Message, 'id' | 'senderId' | 'text' | 'createdAt'>;
};

type ChatEventReadUpdated = {
  conversationId: string;
  userId: string;
  lastReadMessageId: string;
  updatedAt: string;
};

const READ_DEBOUNCE_MS = 700;

export function LineLikeChat({ conversationId, currentUserId }: { conversationId: string; currentUserId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reads, setReads] = useState<ConversationRead[]>([]);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'connecting' | 'connected' | 'reconnecting' | 'reauth-required'>('connecting');
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const readDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const partnerRead = useMemo(() => reads.find((read) => read.userId !== currentUserId) ?? null, [reads, currentUserId]);

  const latestOwnMessageId = useMemo(() => {
    const reversed = [...messages].reverse();
    return reversed.find((message) => message.senderId === currentUserId)?.id ?? null;
  }, [messages, currentUserId]);

  const showReadBadge = partnerRead && latestOwnMessageId ? partnerRead.lastReadMessageId >= latestOwnMessageId : false;

  // Reconnect補完はLast-Event-IDではなくHTTP再取得を採用し、
  // 実装と運用を単純化する（切断中の欠損はこの再取得で埋める）。
  const fetchState = useCallback(async () => {
    const response = await fetch(`/api/chat/conversations/${conversationId}/messages?limit=50`, { cache: 'no-store' });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('AUTH_401');
      }
      throw new Error('FETCH_FAILED');
    }

    const payload = (await response.json()) as { messages: Message[]; reads: ConversationRead[] };
    setMessages(payload.messages ?? []);
    setReads(payload.reads ?? []);
  }, [conversationId]);

  const refreshSession = useCallback(async () => {
    const response = await fetch('/api/auth/refresh', { method: 'POST' });
    if (response.status === 204) {
      return true;
    }

    return false;
  }, []);

  const withRefreshRetry = useCallback(
    async (request: () => Promise<Response>) => {
      const first = await request();
      if (first.status !== 401) {
        return first;
      }

      const refreshed = await refreshSession();
      if (!refreshed) {
        setStatus('reauth-required');
        setError('セッションの再認証が必要です。ログインし直してください。');
        return first;
      }

      return request();
    },
    [refreshSession]
  );

  useEffect(() => {
    let source: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let alive = true;

    const connect = async () => {
      setStatus((current) => (current === 'connected' ? 'connected' : 'connecting'));
      source = new EventSource('/api/chat/events');

      source.addEventListener('open', async () => {
        if (!alive) return;
        setStatus('connected');
        setError(null);
        try {
          await fetchState();
        } catch {
          // ignore here; background reconnection will handle it
        }
      });

      source.addEventListener('message.created', (event) => {
        const payload = JSON.parse((event as MessageEvent<string>).data) as ChatEventMessageCreated;
        if (payload.conversationId !== conversationId) return;

        setMessages((current) => {
          if (current.some((message) => message.id === payload.message.id)) return current;
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
        const payload = JSON.parse((event as MessageEvent<string>).data) as ChatEventReadUpdated;
        if (payload.conversationId !== conversationId) return;

        setReads((current) => {
          const index = current.findIndex((read) => read.userId === payload.userId);
          if (index === -1) {
            return [...current, payload];
          }

          if (current[index].lastReadMessageId >= payload.lastReadMessageId) {
            return current;
          }

          const next = [...current];
          next[index] = payload;
          return next;
        });
      });

      source.addEventListener('error', async () => {
        source?.close();

        const refreshed = await refreshSession();
        if (!refreshed) {
          setStatus('reauth-required');
          setError('セッション期限切れです。再ログインが必要です。');
          return;
        }

        setStatus('reconnecting');
        reconnectTimer = setTimeout(() => {
          void connect();
        }, 1000);
      });
    };

    void (async () => {
      try {
        await fetchState();
      } catch (error) {
        if ((error as Error).message === 'AUTH_401') {
          const refreshed = await refreshSession();
          if (!refreshed) {
            setStatus('reauth-required');
            setError('セッション期限切れです。再ログインが必要です。');
            return;
          }
          await fetchState();
        }
      }
      await connect();
    })();

    return () => {
      alive = false;
      source?.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (readDebounceRef.current) clearTimeout(readDebounceRef.current);
    };
  }, [conversationId, fetchState, refreshSession]);

  const postRead = useCallback(
    async (lastReadMessageId: string) => {
      await withRefreshRetry(() =>
        fetch(`/api/chat/conversations/${conversationId}/read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lastReadMessageId })
        })
      );
    },
    [conversationId, withRefreshRetry]
  );

  const onScroll = useCallback(() => {
    const list = listRef.current;
    const lastMessage = messages[messages.length - 1];
    if (!list || !lastMessage) return;

    const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 12;
    if (!atBottom) return;

    if (readDebounceRef.current) clearTimeout(readDebounceRef.current);
    readDebounceRef.current = setTimeout(() => {
      void postRead(lastMessage.id);
    }, READ_DEBOUNCE_MS);
  }, [messages, postRead]);

  const onSend = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = text.trim();
      if (!trimmed) return;

      const response = await withRefreshRetry(() =>
        fetch(`/api/chat/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmed })
        })
      );

      if (!response.ok) {
        setError('送信に失敗しました。時間をおいて再試行してください。');
        return;
      }

      setText('');
      setError(null);
    },
    [conversationId, text, withRefreshRetry]
  );

  return (
    <section className="chat" aria-label="1対1チャット">
      <header>
        LINE風チャット <small className="connection-status">状態: {status}</small>
      </header>
      {error ? <p className="hero-label">{error}</p> : null}
      <div ref={listRef} className="chat-messages" onScroll={onScroll}>
        {messages.map((message) => (
          <p key={message.id} className={`message ${message.senderId === currentUserId ? 'user' : 'staff'}`}>
            <strong>{message.senderId === currentUserId ? 'あなた' : '相手'}</strong>: {message.text}
          </p>
        ))}
      </div>
      {showReadBadge ? <p className="hero-label">既読</p> : null}
      <form onSubmit={onSend} className="chat-form">
        <Input value={text} onChange={(event) => setText(event.target.value)} maxLength={2000} />
        <Button type="submit" disabled={!text.trim() || status === 'reauth-required'}>
          送信
        </Button>
      </form>
    </section>
  );
}
