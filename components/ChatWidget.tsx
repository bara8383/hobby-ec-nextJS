'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type ChatMessage = {
  id: string;
  sender: 'user' | 'staff';
  text: string;
};

export function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [connection, setConnection] = useState<'connecting' | 'connected' | 'reconnecting'>('connecting');
  const [postError, setPostError] = useState<string | null>(null);

  useEffect(() => {
    let source: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      setConnection((status) => (status === 'connected' ? 'connected' : 'connecting'));
      source = new EventSource('/api/chat');

      source.onopen = () => {
        setConnection('connected');
      };

      source.onmessage = (event) => {
        const next = JSON.parse(event.data) as ChatMessage[];
        setMessages(next);
      };

      source.onerror = () => {
        setConnection('reconnecting');
        source?.close();
        retryTimer = setTimeout(connect, 1500);
      };
    };

    connect();

    return () => {
      source?.close();
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
    };
  }, []);

  const disabled = useMemo(() => text.trim().length === 0, [text]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setPostError(null);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed })
    });

    if (!response.ok) {
      setPostError('メッセージ送信に失敗しました。時間をおいて再試行してください。');
      return;
    }

    setText('');
  }

  return (
    <section className="chat" aria-label="リアルタイムチャット">
      <header>
        ショップチャット（リアルタイム）
        <small className="connection-status">状態: {connection}</small>
      </header>
      <div className="chat-messages">
        {messages.map((message) => (
          <p key={message.id} className={`message ${message.sender}`}>
            {message.text}
          </p>
        ))}
      </div>
      <form onSubmit={onSubmit}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="配送や在庫について質問できます"
        />
        <button type="submit" disabled={disabled}>
          送信
        </button>
      </form>
      {postError ? <p className="chat-error">{postError}</p> : null}
    </section>
  );
}
