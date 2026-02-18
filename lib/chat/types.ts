export type ChatConversation = {
  conversationId: string;
  participants: string[];
  createdAt: string;
};

export type ChatMessage = {
  messageId: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export type ChatHistoryPage = {
  messages: ChatMessage[];
  nextCursor: string | null;
};

export type ChatEvent = {
  type: 'message.created';
  conversationId: string;
  messageId: string;
  createdAt: string;
  requestId: string;
};
