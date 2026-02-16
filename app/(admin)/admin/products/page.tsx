import type { Metadata } from 'next';
import { listProducts } from '@/lib/db/repositories/product-repository';

export const metadata: Metadata = {
  title: '管理: 商品一覧',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminProductsPage() {
  const items = listProducts();

  return (
    <main>
      <h1>管理画面: 商品一覧</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} ({item.slug}) / ¥{item.priceJpy.toLocaleString('ja-JP')}
          </li>
        ))}
      </ul>
    </main>
  );
}
