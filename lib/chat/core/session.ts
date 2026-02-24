import { cookies } from 'next/headers';
import {
  extendSession,
  findSession,
  getOAuthTokens,
  issueSession,
  rotateSession,
  shouldRefreshSession,
  upsertOAuthTokens
} from '@/lib/chat/core/store';
import { readCookie, UnauthorizedError } from '@/lib/chat/core/security';

export const CHAT_SESSION_COOKIE = 'chat_session_id';

export function requireUser(request: Request) {
  const sessionId = readCookie(request, CHAT_SESSION_COOKIE);
  const session = findSession(sessionId);
  if (!session) throw new UnauthorizedError('unauthorized');
  return session;
}

export async function issueSessionCookie(userId: string) {
  const cookieStore = await cookies();
  const session = issueSession(userId);
  cookieStore.set(CHAT_SESSION_COOKIE, session.sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(session.expiresAt)
  });
  return session;
}

// Transparent refresh policy: only extend when expiry is close to keep write-cost low while preserving UX.
export async function maybeExtendSessionCookie(sessionId: string) {
  const session = findSession(sessionId);
  if (!session || !shouldRefreshSession(session)) return null;
  const extended = extendSession(sessionId);
  if (!extended) return null;

  const cookieStore = await cookies();
  cookieStore.set(CHAT_SESSION_COOKIE, extended.sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(extended.expiresAt)
  });

  return extended;
}

export async function refreshSessionByCognito(sessionId: string | undefined) {
  const existing = findSession(sessionId);
  if (!existing) throw new UnauthorizedError('session_not_found');

  const token = getOAuthTokens(existing.userId);
  if (!token) throw new UnauthorizedError('missing_refresh_token');

  // Learning implementation: emulate Cognito refresh-token grant locally.
  // In production, call Cognito /oauth2/token and persist access token + expires_at.
  if (!token.cognitoRefreshToken.startsWith('demo-refresh-')) {
    throw new UnauthorizedError('refresh_failed');
  }

  upsertOAuthTokens({
    userId: existing.userId,
    cognitoRefreshToken: token.cognitoRefreshToken,
    cognitoAccessToken: `rotated-${Date.now()}`,
    cognitoAccessExpiresAt: Date.now() + 1000 * 60 * 60
  });

  const rotated = rotateSession(existing);
  const cookieStore = await cookies();
  cookieStore.set(CHAT_SESSION_COOKIE, rotated.sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(rotated.expiresAt)
  });

  return rotated;
}
