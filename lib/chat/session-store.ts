import { randomBytes } from 'crypto';

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;

export const CHAT_SESSION_COOKIE = 'chat_session_id';

type SessionRecord = {
  sessionId: string;
  userId: string;
  expiresAt: number;
};

const sessions = new Map<string, SessionRecord>();

function createSessionId() {
  return randomBytes(32).toString('base64url');
}

function isExpired(session: SessionRecord) {
  return session.expiresAt <= Date.now();
}

function cleanupExpiredSessions() {
  for (const [sessionId, session] of sessions.entries()) {
    if (isExpired(session)) {
      sessions.delete(sessionId);
    }
  }
}

export function issueChatSession(userId: string) {
  cleanupExpiredSessions();
  const sessionId = createSessionId();
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(sessionId, { sessionId, userId, expiresAt });
  return { sessionId, expiresAt };
}

export function resolveSessionUser(sessionId: string | undefined) {
  if (!sessionId) {
    return null;
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }

  if (isExpired(session)) {
    sessions.delete(sessionId);
    return null;
  }

  return session.userId;
}
