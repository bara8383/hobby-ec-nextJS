import type { Metadata } from 'next';
import Link from 'next/link';
import { getProductBySlug } from '@/data/products';
import { listPurchasedItemsByUser } from '@/lib/db/repositories/order-repository';

export const metadata: Metadata = {
  title: '購入済みライブラリ',
  description: '購入済み商品の再ダウンロード管理ページです。',
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: '/mypage/library'
  }
};

export default function LibraryPage() {
  const items = listPurchasedItemsByUser('user-demo');

  return (
    <main>
      <h1>購入済みライブラリ</h1>
      {items.length === 0 ? (
        <p>購入済み商品はまだありません。</p>
      ) : (
        <ul>
          {items.map((item) => {
            const product = getProductBySlug(item.productSlug);
            return (
              <li key={item.id}>
                {product?.name ?? item.productSlug} / 数量: {item.quantity} /{' '}
                <Link href={`/mypage/library/${item.id}`}>ダウンロードURLを発行</Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
