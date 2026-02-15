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

  useEffect(() => {
    const source = new EventSource('/api/chat');

    source.onmessage = (event) => {
      const next = JSON.parse(event.data) as ChatMessage[];
      setMessages(next);
    };

    return () => source.close();
  }, []);

  const disabled = useMemo(() => text.trim().length === 0, [text]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed })
    });

    setText('');
  }

  return (
    <section className="chat" aria-label="リアルタイムチャット">
      <header>ショップチャット（リアルタイム）</header>
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
    </section>
  );
}
