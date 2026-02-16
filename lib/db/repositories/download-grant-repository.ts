import { createHash, randomUUID } from 'crypto';
import type { DownloadGrantRecord } from '@/lib/db/schema/order';

const downloadGrants: DownloadGrantRecord[] = [];

const DEFAULT_MAX_DOWNLOAD_COUNT = 5;
const DEFAULT_TTL_DAYS = 30;

function toTokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function issueDownloadGrant(params: {
  orderItemId: string;
  userId: string;
  maxDownloadCount?: number;
  ttlDays?: number;
}) {
  const token = randomUUID();
  const now = Date.now();
  const maxDownloadCount = params.maxDownloadCount ?? DEFAULT_MAX_DOWNLOAD_COUNT;
  const ttlDays = params.ttlDays ?? DEFAULT_TTL_DAYS;

  const expiresAt = new Date(now + ttlDays * 24 * 60 * 60 * 1000).toISOString();

  const existing = downloadGrants.find(
    (grant) => grant.orderItemId === params.orderItemId && grant.userId === params.userId
  );

  if (existing) {
    existing.downloadTokenHash = toTokenHash(token);
    existing.expiresAt = expiresAt;
    existing.maxDownloadCount = maxDownloadCount;
    existing.downloadedCount = 0;
    existing.lastDownloadedAt = undefined;

    return {
      grant: existing,
      token
    };
  }

  const created: DownloadGrantRecord = {
    id: randomUUID(),
    orderItemId: params.orderItemId,
    userId: params.userId,
    downloadTokenHash: toTokenHash(token),
    expiresAt,
    maxDownloadCount,
    downloadedCount: 0
  };

  downloadGrants.push(created);

  return {
    grant: created,
    token
  };
}

export function getDownloadGrantByOrderItem(orderItemId: string, userId: string) {
  return downloadGrants.find((grant) => grant.orderItemId === orderItemId && grant.userId === userId);
}

export function consumeDownloadGrant(orderItemId: string, userId: string) {
  const grant = getDownloadGrantByOrderItem(orderItemId, userId);
  if (!grant) {
    return { ok: false as const, reason: 'grant_not_found' as const };
  }

  if (Date.now() > new Date(grant.expiresAt).getTime()) {
    return { ok: false as const, reason: 'expired' as const };
  }

  if (grant.downloadedCount >= grant.maxDownloadCount) {
    return { ok: false as const, reason: 'download_limit_exceeded' as const };
  }

  grant.downloadedCount += 1;
  grant.lastDownloadedAt = new Date().toISOString();

  return {
    ok: true as const,
    grant
  };
}

export function getRemainingDownloadCount(orderItemId: string, userId: string) {
  const grant = getDownloadGrantByOrderItem(orderItemId, userId);
  if (!grant) {
    return 0;
  }

  return Math.max(grant.maxDownloadCount - grant.downloadedCount, 0);
}
