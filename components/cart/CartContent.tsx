import { products } from '@/data/products';
import { readCart } from '@/lib/store/cart';
import { CartLineActions } from '@/components/cart/CartLineActions';
import { ClearCartButton } from '@/components/cart/ClearCartButton';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';

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
    return (
      <Section className="empty-state" title="カートは空です" description="商品詳細ページから商品を追加すると、ここに表示されます。">
        <ButtonLink href="/products" variant="secondary">
          商品一覧を見る
        </ButtonLink>
      </Section>
    );
  }

  return (
    <>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.product.slug}>
            <Card className="cart-item">
              <div>
                <Badge variant="muted">{item.product.category}</Badge>
                <strong>{item.product.name}</strong>
                <p>価格: ¥{item.product.priceJpy.toLocaleString('ja-JP')}</p>
                <p>数量: {item.quantity}</p>
              </div>
              <CartLineActions productSlug={item.product.slug} quantity={item.quantity} />
            </Card>
          </li>
        ))}
      </ul>
      <Card className="cart-summary">
        <p className="price">合計: ¥{total.toLocaleString('ja-JP')}</p>
        <div className="cta-row">
          <ButtonLink href="/checkout">チェックアウトへ進む</ButtonLink>
          <ClearCartButton />
        </div>
      </Card>
    </>
  );
}
