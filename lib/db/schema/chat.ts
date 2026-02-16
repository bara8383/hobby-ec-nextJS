export type ChatSessionRecord = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessageRole = 'user' | 'assistant' | 'system';

export type ChatMessageRecord = {
  id: string;
  sessionId: string;
  role: ChatMessageRole;
  content: string;
  tokenCount: number;
  createdAt: string;
};
