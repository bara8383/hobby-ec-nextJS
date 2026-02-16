import { getOrderItemForUser } from '@/lib/db/repositories/order-repository';
import { consumeDownloadGrant, issueDownloadGrant } from '@/lib/db/repositories/download-grant-repository';
import { issueSignedDownloadUrl } from '@/lib/storage/signed-url';

export async function GET(_request: Request, context: { params: Promise<{ orderItemId: string }> }) {
  const { orderItemId } = await context.params;
  const userId = 'user-demo';

  const item = getOrderItemForUser(orderItemId, userId);

  if (!item) {
    return Response.json({ error: 'not found or unauthorized' }, { status: 404 });
  }

  const consumed = consumeDownloadGrant(orderItemId, userId);

  if (!consumed.ok) {
    if (consumed.reason === 'grant_not_found') {
      issueDownloadGrant({ orderItemId, userId });
      return Response.json(
        { error: 'download grant was missing. please retry for a fresh link.' },
        { status: 409 }
      );
    }

    if (consumed.reason === 'expired') {
      return Response.json({ error: 'download period expired' }, { status: 403 });
    }

    return Response.json({ error: 'download limit exceeded' }, { status: 403 });
  }

  const signed = issueSignedDownloadUrl({
    objectKey: `${item.productSlug}.zip`,
    ttlSeconds: 300
  });

  const remainingCount = Math.max(
    consumed.grant.maxDownloadCount - consumed.grant.downloadedCount,
    0
  );

  return Response.json(
    {
      ...signed,
      remainingCount,
      maxDownloadCount: consumed.grant.maxDownloadCount,
      consumedCount: consumed.grant.downloadedCount,
      grantExpiresAt: consumed.grant.expiresAt
    },
    { status: 200 }
  );
}
