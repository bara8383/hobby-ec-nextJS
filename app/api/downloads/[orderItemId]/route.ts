import { getOrderItemForUser } from '@/lib/db/repositories/order-repository';
import { issueSignedDownloadUrl } from '@/lib/storage/signed-url';

export async function GET(_request: Request, context: { params: Promise<{ orderItemId: string }> }) {
  const { orderItemId } = await context.params;
  const userId = 'user-demo';

  const item = getOrderItemForUser(orderItemId, userId);

  if (!item) {
    return Response.json({ error: 'not found or unauthorized' }, { status: 404 });
  }

  const signed = issueSignedDownloadUrl({
    objectKey: `${item.productSlug}.zip`,
    ttlSeconds: 300
  });

  return Response.json(signed, { status: 200 });
}
