import Link from 'next/link';
import { products } from '@/data/products';
import { clearCart, readCart, removeCartLine } from '@/lib/store/cart';

async function removeItemAction(formData: FormData) {
  'use server';

  const productSlug = formData.get('productSlug');
  if (typeof productSlug !== 'string') {
    return;
  }

  await removeCartLine(productSlug);
}

async function clearCartAction() {
  'use server';

  await clearCart();
}

export async function CartContent() {
  const lines = await readCart();

  const items = lines
    .map((line) => {
      const product = products.find((entry) => entry.slug === line.productSlug);
      return product ? { ...line, product } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

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
              <form action={removeItemAction}>
                <input type="hidden" name="productSlug" value={item.product.slug} />
                <button type="submit">削除</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
      <p>合計: ¥{total.toLocaleString('ja-JP')}</p>
      <div className="cta-row">
        <Link href="/checkout">チェックアウトへ進む</Link>
        <form action={clearCartAction}>
          <button type="submit">カートを空にする</button>
        </form>
      </div>
    </>
  );
}
