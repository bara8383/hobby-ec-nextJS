import { cookies } from 'next/headers';

export class UnauthorizedError extends Error {}

export async function requireUserId(request: Request) {
  const fromHeader = request.headers.get('x-user-id');
  if (fromHeader) return fromHeader;

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get('chat_demo_user_id')?.value;
  if (fromCookie) return fromCookie;

  throw new UnauthorizedError('authentication required');
}
