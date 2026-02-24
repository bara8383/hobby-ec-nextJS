import { randomBytes, randomUUID } from 'crypto';
import type { Conversation, ConversationRead, Message, OAuthTokenRecord, SessionRecord } from '@/lib/chat/core/types';

const SESSION_TTL_MS = 1000 * 60 * 30;
const SESSION_REFRESH_THRESHOLD_MS = 1000 * 60 * 5;

const conversations = new Map<string, Conversation>();
const messagesByConversation = new Map<string, Message[]>();
const conversationReads = new Map<string, ConversationRead>();
const sessions = new Map<string, SessionRecord>();
const oauthTokens = new Map<string, OAuthTokenRecord>();

const readKey = (conversationId: string, userId: string) => `${conversationId}:${userId}`;

function nowIso() {
  return new Date().toISOString();
}

function sortableMessageId() {
  const ts = Date.now().toString().padStart(13, '0');
  return `${ts}_${randomUUID().slice(0, 10)}`;
}

export function createSessionId() {
  return randomBytes(32).toString('base64url');
}

export function buildConversationId(userAId: string, userBId: string) {
  const [a, b] = [userAId, userBId].sort();
  return `conv_${a}_${b}`;
}

export function ensureConversation(userAId: string, userBId: string) {
  const id = buildConversationId(userAId, userBId);
  const existing = conversations.get(id);
  if (existing) return existing;

  const now = nowIso();
  const record: Conversation = { id, userAId, userBId, createdAt: now, updatedAt: now };
  conversations.set(id, record);
  messagesByConversation.set(id, []);
  return record;
}

export function listConversationsByUser(userId: string) {
  return [...conversations.values()]
    .filter((conversation) => isParticipant(conversation, userId))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function findConversationByProduct(userId: string, productId: string) {
  return (
    [...conversations.values()].find(
      (conversation) => isParticipant(conversation, userId) && conversation.productId === productId
    ) ?? null
  );
}

export function createConversation(params: { userId: string; productId: string; productSlug?: string; partnerUserId?: string }) {
  const partnerUserId = params.partnerUserId ?? 'seller-demo';
  const now = nowIso();
  const conversation: Conversation = {
    id: `conv_${randomUUID()}`,
    userAId: params.userId,
    userBId: partnerUserId,
    productId: params.productId,
    productSlug: params.productSlug,
    createdAt: now,
    updatedAt: now
  };

  conversations.set(conversation.id, conversation);
  messagesByConversation.set(conversation.id, []);
  return conversation;
}

export function findConversation(conversationId: string) {
  return conversations.get(conversationId) ?? null;
}

export function isParticipant(conversation: Conversation, userId: string) {
  return conversation.userAId === userId || conversation.userBId === userId;
}

export function participants(conversation: Conversation) {
  return [conversation.userAId, conversation.userBId];
}

export function createMessage(conversationId: string, senderId: string, text: string) {
  const messages = messagesByConversation.get(conversationId);
  if (!messages) return null;
  const message: Message = { id: sortableMessageId(), conversationId, senderId, text, createdAt: nowIso() };
  messages.push(message);
  const conversation = conversations.get(conversationId);
  if (conversation) {
    conversation.updatedAt = message.createdAt;
  }
  return message;
}

export function findMessage(conversationId: string, messageId: string) {
  const messages = messagesByConversation.get(conversationId) ?? [];
  return messages.find((message) => message.id === messageId) ?? null;
}

export function listMessages(conversationId: string, cursor: string | null, limit: number) {
  const messages = messagesByConversation.get(conversationId) ?? [];
  const sortedDesc = [...messages].sort((a, b) => (a.id < b.id ? 1 : -1));
  const start = cursor ? sortedDesc.findIndex((message) => message.id === cursor) + 1 : 0;
  const pageDesc = sortedDesc.slice(Math.max(start, 0), Math.max(start, 0) + limit);
  const nextCursor = pageDesc.length === limit ? pageDesc[pageDesc.length - 1]?.id ?? null : null;
  return { messages: [...pageDesc].reverse(), nextCursor };
}

export function listReads(conversationId: string) {
  return [...conversationReads.values()].filter((read) => read.conversationId === conversationId);
}

export function updateReadProgress(conversationId: string, userId: string, lastReadMessageId: string) {
  const key = readKey(conversationId, userId);
  const current = conversationReads.get(key);

  // Idempotency rule: keep only forward progress; stale updates are ignored.
  if (current && current.lastReadMessageId >= lastReadMessageId) {
    return { changed: false as const, record: current };
  }

  const record: ConversationRead = { conversationId, userId, lastReadMessageId, updatedAt: nowIso() };
  conversationReads.set(key, record);
  return { changed: true as const, record };
}

export function issueSession(userId: string) {
  const sessionId = createSessionId();
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const record: SessionRecord = { sessionId, userId, expiresAt };
  sessions.set(sessionId, record);
  return record;
}

export function rotateSession(session: SessionRecord) {
  sessions.delete(session.sessionId);
  const next = issueSession(session.userId);
  return next;
}

export function findSession(sessionId: string | undefined) {
  if (!sessionId) return null;
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    return null;
  }
  return session;
}

export function shouldRefreshSession(session: SessionRecord) {
  return session.expiresAt - Date.now() <= SESSION_REFRESH_THRESHOLD_MS;
}

export function extendSession(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  const next = { ...session, expiresAt: Date.now() + SESSION_TTL_MS };
  sessions.set(sessionId, next);
  return next;
}

export function upsertOAuthTokens(record: OAuthTokenRecord) {
  oauthTokens.set(record.userId, record);
}

export function getOAuthTokens(userId: string) {
  return oauthTokens.get(userId) ?? null;
}

// Seed data for learning UX.
ensureConversation('buyer-demo', 'seller-demo');
upsertOAuthTokens({
  userId: 'buyer-demo',
  cognitoRefreshToken: 'demo-refresh-buyer',
  cognitoAccessToken: 'demo-access-buyer',
  cognitoAccessExpiresAt: Date.now() + 1000 * 60 * 60
});
upsertOAuthTokens({
  userId: 'seller-demo',
  cognitoRefreshToken: 'demo-refresh-seller',
  cognitoAccessToken: 'demo-access-seller',
  cognitoAccessExpiresAt: Date.now() + 1000 * 60 * 60
});
