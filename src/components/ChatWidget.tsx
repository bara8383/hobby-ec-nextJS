"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { ApiErrorResponse } from "@/types/api";

type Message = {
  id: number;
  user: string;
  text: string;
  createdAt: string;
};

type ChatListResponse = {
  messages: Message[];
};

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);

  const resolveErrorMessage = (error: ApiErrorResponse) => {
    switch (error.code) {
      case "VALIDATION_ERROR":
        return "メッセージを入力してください。";
      case "EXTERNAL_SERVICE_UNAVAILABLE":
        return "現在チャット連携を利用できません。しばらくしてから再試行してください。";
      default:
        return "チャット処理でエラーが発生しました。";
    }
  };

  const fetchMessages = useCallback(async () => {
    const response = await fetch("/api/chat", { cache: "no-store" });

    if (!response.ok) {
      const error = (await response.json()) as ApiErrorResponse;
      setErrorText(resolveErrorMessage(error));
      return;
    }

    const data = (await response.json()) as ChatListResponse;
    setMessages(data.messages);
    setErrorText(null);
  }, []);

  useEffect(() => {
    fetchMessages();
    const timer = setInterval(fetchMessages, 3000);
    return () => clearInterval(timer);
  }, [fetchMessages]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setErrorText("メッセージを入力してください。");
      return;
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed })
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiErrorResponse;
      setErrorText(resolveErrorMessage(error));
      return;
    }

    setText("");
    setErrorText(null);
    fetchMessages();
  };

  return (
    <div className="space-y-4">
      {errorText && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorText}</p>
      )}
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
