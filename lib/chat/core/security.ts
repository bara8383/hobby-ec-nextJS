export class UnauthorizedError extends Error {}
export class ForbiddenAsNotFoundError extends Error {}
export class CsrfError extends Error {}

function parseCookieHeader(cookieHeader: string | null) {
  const result = new Map<string, string>();
  if (!cookieHeader) return result;

  for (const pair of cookieHeader.split(';')) {
    const trimmed = pair.trim();
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    result.set(trimmed.slice(0, idx), decodeURIComponent(trimmed.slice(idx + 1)));
  }

  return result;
}

export function readCookie(request: Request, key: string) {
  return parseCookieHeader(request.headers.get('cookie')).get(key);
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) throw new CsrfError('missing_origin_or_host');

  const originUrl = new URL(origin);
  if (originUrl.host !== host) throw new CsrfError('origin_host_mismatch');
}
