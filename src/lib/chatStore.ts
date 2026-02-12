type ChatMessage = {
  id: number;
  user: string;
  text: string;
  createdAt: string;
};

const messages: ChatMessage[] = [
  {
    id: 1,
    user: "support",
    text: "いらっしゃいませ！気になる素材があれば質問してください。",
    createdAt: new Date().toISOString()
  }
];

export function addMessage(user: string, text: string) {
  messages.push({
    id: messages.length + 1,
    user,
    text,
    createdAt: new Date().toISOString()
  });
}

export function listMessages() {
  return messages.slice(-20);
}
