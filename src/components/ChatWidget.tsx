"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/ui/Button";

type Message = {
  id: number;
  user: string;
  text: string;
  createdAt: string;
};

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    const response = await fetch("/api/chat", { cache: "no-store" });
    const data = (await response.json()) as { messages: Message[] };
    setMessages(data.messages);
  };

  useEffect(() => {
    fetchMessages();
    const timer = setInterval(fetchMessages, 3000);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed })
    });

    setText("");
    fetchMessages();
  };

  return (
    <div className="space-y-4">
      <div className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
        {messages.map((message) => (
          <div key={message.id} className="text-sm">
            <p className="font-semibold text-slate-700">{message.user}</p>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className="flex-1 rounded-md border border-slate-300 px-3 py-2"
          placeholder="メッセージを入力"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button type="submit">送信</Button>
      </form>
    </div>
  );
}
