import { NextResponse } from 'next/server';
import { DEMO_AUTH_COOKIE } from '@/lib/auth/demo-session';
import { getUserById, listUsers } from '@/lib/db/repositories/user-repository';
import { CHAT_SESSION_COOKIE, issueChatSession } from '@/lib/chat/session-store';

function parseCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return new Map<string, string>();
  return new Map(
    cookieHeader
      .split(';')
      .map((entry) => entry.trim())
      .map((entry) => {
        const index = entry.indexOf('=');
        return [entry.slice(0, index), decodeURIComponent(entry.slice(index + 1))] as const;
      })
  );
}

export async function POST(request: Request) {
  const cookies = parseCookieHeader(request.headers.get('cookie'));
  const fallbackUser = listUsers()[0];
  const userId = cookies.get(DEMO_AUTH_COOKIE) ?? fallbackUser?.id;

  if (!userId || !getUserById(userId)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const session = issueChatSession(userId);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CHAT_SESSION_COOKIE, session.sessionId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
    httpOnly: true,
    sameSite: 'lax',
    secure: true
  });

  return response;
}
