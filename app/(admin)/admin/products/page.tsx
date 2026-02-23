import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth/demo-session';
import { listProducts } from '@/lib/db/repositories/product-repository';

export const metadata: Metadata = {
  title: '管理: 商品一覧',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminProductsPage() {
  await requireRole('admin');
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
