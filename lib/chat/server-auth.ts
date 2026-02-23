import { CHAT_SESSION_COOKIE, resolveSessionUser } from '@/lib/chat/session-store';

export class ChatAuthError extends Error {}

function parseCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) {
    return new Map<string, string>();
  }

  const pairs = cookieHeader.split(';').map((entry) => entry.trim());
  const map = new Map<string, string>();

  for (const pair of pairs) {
    const separatorIndex = pair.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = pair.slice(0, separatorIndex);
    const value = pair.slice(separatorIndex + 1);
    map.set(key, decodeURIComponent(value));
  }

  return map;
}

export function requireSessionUserId(request: Request) {
  const cookieMap = parseCookieHeader(request.headers.get('cookie'));
  const sessionId = cookieMap.get(CHAT_SESSION_COOKIE);
  const userId = resolveSessionUser(sessionId);

  if (!userId) {
    throw new ChatAuthError('unauthorized');
  }

  return userId;
}
