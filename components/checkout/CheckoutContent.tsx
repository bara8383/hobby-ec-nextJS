import { redirect } from 'next/navigation';
import { products } from '@/data/products';
import { createPaidOrder } from '@/lib/db/repositories/order-repository';
import { issueDownloadGrant } from '@/lib/db/repositories/download-grant-repository';
import { getUserById } from '@/lib/db/repositories/user-repository';
import { clearCart, readCart } from '@/lib/store/cart';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';

async function placeOrderAction() {
  'use server';

  const user = getUserById('user-demo');
  if (!user) {
    throw new Error('valid userId is required');
  }

  const lines = (await readCart()).filter((line) => line.quantity > 0);
  if (lines.length === 0) {
    return;
  }

  const pricedLines = lines.map((line) => {
    const product = products.find((entry) => entry.slug === line.productSlug);
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

  await clearCart();
  redirect(`/checkout/success?orderId=${result.order.id}`);
}

export async function CheckoutContent() {
  const lines = await readCart();

  const items = lines
    .map((line) => {
      const product = products.find((entry) => entry.slug === line.productSlug);
      return product ? { ...line, product } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (items.length === 0) {
    return (
      <Section title="注文商品がありません" description="先にカートへ商品を追加してからチェックアウトしてください。" className="empty-state">
        <ButtonLink href="/products" variant="secondary">
          商品一覧へ戻る
        </ButtonLink>
      </Section>
    );
  }

  const total = items.reduce((sum, item) => sum + item.product.priceJpy * item.quantity, 0);

  return (
    <Card>
      <h2>注文内容</h2>
      <ul className="checkout-list">
        {items.map((item) => (
          <li key={item.product.slug}>
            {item.product.name} × {item.quantity}
          </li>
        ))}
      </ul>
      <p className="price">合計: ¥{total.toLocaleString('ja-JP')}</p>
      <form action={placeOrderAction}>
        <Button type="submit">注文確定</Button>
      </form>
    </Card>
  );
}
