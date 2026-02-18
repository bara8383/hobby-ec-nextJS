import Link from 'next/link';
import { products } from '@/data/products';
import { readCart } from '@/lib/store/cart';
import { CartLineActions } from '@/components/cart/CartLineActions';
import { ClearCartButton } from '@/components/cart/ClearCartButton';

export async function CartContent() {
  const lines = await readCart();

  const items = lines
    .map((line) => {
      const product = products.find((entry) => entry.slug === line.productSlug);
      return product ? { ...line, product } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const total = items.reduce((sum, item) => sum + item.product.priceJpy * item.quantity, 0);

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
              <p>数量: {item.quantity}</p>
            </div>
            <CartLineActions productSlug={item.product.slug} quantity={item.quantity} />
          </li>
        ))}
      </ul>
      <p>合計: ¥{total.toLocaleString('ja-JP')}</p>
      <div className="cta-row">
        <Link href="/checkout">チェックアウトへ進む</Link>
        <ClearCartButton />
      </div>
    </>
  );
}
