'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { clearCart, readCart } from '@/lib/store/cart';

export function CheckoutContent() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const lines = readCart();
  const items = useMemo(
    () =>
      lines
        .map((line) => {
          const product = products.find((entry) => entry.slug === line.productSlug);
          return product ? { ...line, product } : null;
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [lines]
  );

  async function placeOrder() {
    setSubmitting(true);
    setError(null);

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user-demo',
        lines: items.map((item) => ({ productSlug: item.product.slug, quantity: item.quantity }))
      })
    });

    if (!response.ok) {
      setError('注文処理に失敗しました。入力内容を確認してください。');
      setSubmitting(false);
      return;
    }

    const body = (await response.json()) as { orderId: string };
    clearCart();
    router.push(`/checkout/success?orderId=${body.orderId}`);
  }

  if (items.length === 0) {
    return <p>カートが空です。先に商品を追加してください。</p>;
  }

  const total = items.reduce((sum, item) => sum + item.product.priceJpy * item.quantity, 0);

  return (
    <section>
      <h2>注文内容</h2>
      <ul>
        {items.map((item) => (
          <li key={item.product.slug}>
            {item.product.name} × {item.quantity}
          </li>
        ))}
      </ul>
      <p>合計: ¥{total.toLocaleString('ja-JP')}</p>
      <button type="button" disabled={submitting} onClick={placeOrder}>
        {submitting ? '処理中...' : '注文確定'}
      </button>
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
