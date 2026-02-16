import { randomUUID } from 'crypto';

export type ChatMessage = {
  id: string;
  sender: 'user' | 'staff';
  text: string;
  createdAt: string;
};

const initial: ChatMessage[] = [
  {
    id: randomUUID(),
    sender: 'staff',
    text: 'こんにちは！デジタル商品のライセンス・利用範囲の質問をどうぞ。',
    createdAt: new Date().toISOString()
  }
];

const globalStore = globalThis as typeof globalThis & {
  __chatMessages?: ChatMessage[];
};

if (!globalStore.__chatMessages) {
  globalStore.__chatMessages = initial;
}

export async function listChatMessages() {
  return [...(globalStore.__chatMessages ?? initial)];
}

export async function appendChatMessage(message: Omit<ChatMessage, 'id' | 'createdAt'>) {
  const next: ChatMessage = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...message
  };

  const target = globalStore.__chatMessages ?? initial;
  target.push(next);

  if (target.length > 40) {
    target.splice(0, target.length - 40);
  }

  return next;
}
