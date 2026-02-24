type Bucket = { tokens: number; updatedAt: number };

const buckets = new Map<string, Bucket>();

export function hitRateLimit(key: string, maxPerMinute: number) {
  const now = Date.now();
  const current = buckets.get(key) ?? { tokens: maxPerMinute, updatedAt: now };
  const refill = ((now - current.updatedAt) / 60000) * maxPerMinute;
  current.tokens = Math.min(maxPerMinute, current.tokens + refill);
  current.updatedAt = now;

  if (current.tokens < 1) {
    buckets.set(key, current);
    return true;
  }

  current.tokens -= 1;
  buckets.set(key, current);
  return false;
}
