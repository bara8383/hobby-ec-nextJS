import { NextResponse } from 'next/server';
import { CHAT_SESSION_COOKIE, refreshSessionByCognito } from '@/lib/chat/core/session';
import { CsrfError, UnauthorizedError, assertSameOrigin, readCookie } from '@/lib/chat/core/security';
import { hitRateLimit } from '@/lib/chat/core/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const sessionId = readCookie(request, CHAT_SESSION_COOKIE);

    if (hitRateLimit(`refresh:${sessionId ?? 'anonymous'}`, 20)) {
      return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
    }

    await refreshSessionByCognito(sessionId);

    // Client only needs updated cookie and can retry the failed request.
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'reauth_required' }, { status: 401 });
    }
    if (error instanceof CsrfError) {
      return NextResponse.json({ error: 'csrf_failed' }, { status: 422 });
    }
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}
