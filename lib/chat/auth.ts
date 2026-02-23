import { cookies } from 'next/headers';
import { DEMO_AUTH_COOKIE } from '@/lib/auth/demo-session';

export class UnauthorizedError extends Error {}

export async function requireUserId(request: Request) {
  const fromHeader = request.headers.get('x-user-id');
  if (fromHeader) return fromHeader;

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(DEMO_AUTH_COOKIE)?.value;
  if (fromCookie) return fromCookie;

  throw new UnauthorizedError('authentication required');
}
