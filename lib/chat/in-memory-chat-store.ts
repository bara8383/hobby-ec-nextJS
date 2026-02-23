import { randomUUID } from 'crypto';
import type { Conversation, ConversationRead, Message } from '@/lib/chat/realtime-types';

const conversations = new Map<string, Conversation>();
const messagesByConversation = new Map<string, Message[]>();
const conversationReads = new Map<string, ConversationRead>();

function readKey(conversationId: string, userId: string) {
  return `${conversationId}:${userId}`;
}

function nowIso() {
  return new Date().toISOString();
}

function sortableMessageId() {
  const ts = Date.now().toString().padStart(13, '0');
  return `${ts}_${randomUUID().slice(0, 8)}`;
}

export function buildConversationId(userAId: string, userBId: string) {
  const [a, b] = [userAId, userBId].sort();
  return `conv_${a}_${b}`;
}

export function ensureConversation(userAId: string, userBId: string) {
  const id = buildConversationId(userAId, userBId);
  const existing = conversations.get(id);
  if (existing) {
    return existing;
  }

  const conversation: Conversation = {
    id,
    userAId,
    userBId,
    createdAt: nowIso()
  };

  conversations.set(id, conversation);
  messagesByConversation.set(id, []);

  return conversation;
}

export function getConversation(conversationId: string) {
  return conversations.get(conversationId) ?? null;
}

export function isParticipant(conversation: Conversation, userId: string) {
  return conversation.userAId === userId || conversation.userBId === userId;
}

export function listParticipants(conversation: Conversation) {
  return [conversation.userAId, conversation.userBId];
}

export function createMessage(conversationId: string, senderId: string, text: string) {
  const list = messagesByConversation.get(conversationId);
  if (!list) {
    return null;
  }

  const message: Message = {
    id: sortableMessageId(),
    conversationId,
    senderId,
    text,
    createdAt: nowIso()
  };

  list.push(message);
  return message;
}

export function listMessages(conversationId: string, cursor: string | null, limit: number) {
  const list = messagesByConversation.get(conversationId) ?? [];
  const sorted = [...list].sort((a, b) => (a.id < b.id ? 1 : -1));

  const startIndex = cursor ? sorted.findIndex((message) => message.id === cursor) : -1;
  const sliceStart = startIndex >= 0 ? startIndex + 1 : 0;
  const page = sorted.slice(sliceStart, sliceStart + limit);
  const nextCursor = page.length === limit ? page[page.length - 1]?.id ?? null : null;

  return {
    messages: [...page].reverse(),
    nextCursor
  };
}


export function findMessage(conversationId: string, messageId: string) {
  const list = messagesByConversation.get(conversationId) ?? [];
  return list.find((message) => message.id === messageId) ?? null;
}


export function listConversationReads(conversationId: string) {
  const reads: ConversationRead[] = [];
  for (const read of conversationReads.values()) {
    if (read.conversationId === conversationId) {
      reads.push(read);
    }
  }
  return reads;
}

export function getConversationRead(conversationId: string, userId: string) {
  return conversationReads.get(readKey(conversationId, userId)) ?? null;
}

export function updateConversationReadProgress(conversationId: string, userId: string, lastReadMessageId: string) {
  const key = readKey(conversationId, userId);
  const current = conversationReads.get(key);

  if (current && current.lastReadMessageId >= lastReadMessageId) {
    return { changed: false as const, record: current };
  }

  const record: ConversationRead = {
    conversationId,
    userId,
    lastReadMessageId,
    updatedAt: nowIso()
  };

  conversationReads.set(key, record);
  return { changed: true as const, record };
}

// Learning-purpose seed data: create one conversation so first load can render instantly.
ensureConversation('buyer-demo', 'seller-demo');
