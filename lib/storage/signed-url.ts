import { randomUUID } from 'crypto';

type SignedUrlInput = {
  objectKey: string;
  ttlSeconds: number;
};

export function issueSignedDownloadUrl({ objectKey, ttlSeconds }: SignedUrlInput) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const token = randomUUID();

  return {
    url: `/downloads/mock/${encodeURIComponent(objectKey)}?token=${token}&exp=${expiresAt}`,
    expiresAt
  };
}
