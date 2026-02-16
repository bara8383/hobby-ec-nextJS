'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { products } from '@/data/products';
import { clearCart, readCart, removeCartLine } from '@/lib/store/cart';

export function CartContent() {
  const [lines, setLines] = useState(() => readCart());

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

  function removeItem(slug: string) {
    removeCartLine(slug);
    setLines(readCart());
  }

  function resetCart() {
    clearCart();
    setLines([]);
  }

  const total = items.reduce((sum, item) => sum + item.product.priceJpy, 0);

  if (items.length === 0) {
    return <p>カートに商品がありません。商品詳細から追加してください。</p>;
  }

  return (
    <>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.product.slug} className="cart-item">
            <div>
              <strong>{item.product.name}</strong>
              <p>価格: ¥{item.product.priceJpy.toLocaleString('ja-JP')}</p>
            </div>
            <div className="cart-item-actions">
              <button type="button" onClick={() => removeItem(item.product.slug)}>
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p>合計: ¥{total.toLocaleString('ja-JP')}</p>
      <div className="cta-row">
        <Link href="/checkout">チェックアウトへ進む</Link>
        <button type="button" onClick={resetCart}>
          カートを空にする
        </button>
      </div>
    </>
  );
}
