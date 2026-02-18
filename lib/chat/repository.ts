import { randomUUID } from 'crypto';
import type { ChatConversation, ChatHistoryPage, ChatMessage } from '@/lib/chat/types';

const conversations = new Map<string, ChatConversation>();
const messagesByConversation = new Map<string, ChatMessage[]>();
const idempotencyMap = new Map<string, string>();

export async function getConversation(conversationId: string) {
  return conversations.get(conversationId) ?? null;
}

export async function ensureConversation(conversationId: string, participants: string[]) {
  const existing = await getConversation(conversationId);
  if (existing) return existing;

  const conversation: ChatConversation = {
    conversationId,
    participants,
    createdAt: new Date().toISOString()
  };

  conversations.set(conversationId, conversation);
  return conversation;
}

export async function createMessageWithIdempotency(params: {
  conversationId: string;
  senderId: string;
  body: string;
  idempotencyKey: string;
}) {
  const idemKey = `${params.conversationId}#${params.senderId}#${params.idempotencyKey}`;
  const existing = idempotencyMap.get(idemKey);
  if (existing) return existing;

  const messageId = randomUUID();
  const now = new Date().toISOString();
  const target = messagesByConversation.get(params.conversationId) ?? [];

  target.push({
    messageId,
    conversationId: params.conversationId,
    senderId: params.senderId,
    body: params.body,
    createdAt: now
  });

  messagesByConversation.set(params.conversationId, target);
  idempotencyMap.set(idemKey, messageId);

  return messageId;
}

export async function listConversationMessages(params: {
  conversationId: string;
  cursor?: string | null;
  limit: number;
}): Promise<ChatHistoryPage> {
  const rows = messagesByConversation.get(params.conversationId) ?? [];

  if (!params.cursor) {
    return {
      messages: rows.slice(-params.limit),
      nextCursor: rows.length > params.limit ? rows[rows.length - params.limit].messageId : null
    };
  }

  const index = rows.findIndex((entry) => entry.messageId === params.cursor);
  if (index <= 0) {
    return {
      messages: [],
      nextCursor: null
    };
  }

  const start = Math.max(index - params.limit, 0);
  return {
    messages: rows.slice(start, index),
    nextCursor: start > 0 ? rows[start].messageId : null
  };
}

export async function ensureSupportConversationForUser(userId: string, conversationId: string) {
  return ensureConversation(conversationId, [userId, 'staff-agent']);
}

export function isParticipant(conversation: ChatConversation, userId: string) {
  return conversation.participants.includes(userId);
}
