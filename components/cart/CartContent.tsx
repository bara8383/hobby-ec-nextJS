'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { products } from '@/data/products';
import { readCart } from '@/lib/store/cart';

export function CartContent() {
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

  const total = items.reduce((sum, item) => sum + item.product.priceJpy * item.quantity, 0);

  if (items.length === 0) {
    return <p>カートに商品がありません。商品詳細から追加してください。</p>;
  }

  return (
    <>
      <ul>
        {items.map((item) => (
          <li key={item.product.slug}>
            {item.product.name} × {item.quantity} / ¥
            {(item.product.priceJpy * item.quantity).toLocaleString('ja-JP')}
          </li>
        ))}
      </ul>
      <p>合計: ¥{total.toLocaleString('ja-JP')}</p>
      <Link href="/checkout">チェックアウトへ進む</Link>
    </>
  );
}
