import { getProductBySlug } from '@/data/products';
import { createPaidOrder } from '@/lib/db/repositories/order-repository';
import { issueDownloadGrant } from '@/lib/db/repositories/download-grant-repository';
import { getUserById } from '@/lib/db/repositories/user-repository';

type CheckoutLine = {
  productSlug: string;
  quantity: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as {
    userId?: string;
    lines?: CheckoutLine[];
  };

  const user = body.userId ? getUserById(body.userId) : undefined;
  if (!user) {
    return Response.json({ error: 'valid userId is required' }, { status: 400 });
  }

  const lines = (body.lines ?? []).filter((line) => line.quantity > 0);
  if (lines.length === 0) {
    return Response.json({ error: 'at least one cart item is required' }, { status: 400 });
  }

  const pricedLines = lines.map((line) => {
    const product = getProductBySlug(line.productSlug);
    if (!product) {
      throw new Error(`unknown product slug: ${line.productSlug}`);
    }

    return {
      productSlug: line.productSlug,
      quantity: line.quantity,
      unitPriceJpy: product.priceJpy
    };
  });

  const result = createPaidOrder(user.id, pricedLines);

  result.items.forEach((item) => {
    issueDownloadGrant({
      orderItemId: item.id,
      userId: user.id
    });
  });

  return Response.json(
    {
      orderId: result.order.id,
      totalJpy: result.order.totalJpy,
      itemCount: result.items.length
    },
    { status: 201 }
  );
}
