import type { Metadata } from 'next';
import Link from 'next/link';
import { getProductBySlug } from '@/data/products';
import {
  getDownloadGrantByOrderItem,
  getRemainingDownloadCount,
  issueDownloadGrant
} from '@/lib/db/repositories/download-grant-repository';
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
  const userId = 'user-demo';
  const items = listPurchasedItemsByUser(userId);

  return (
    <main>
      <h1>購入済みライブラリ</h1>
      <p>ダウンロード可能期間は購入日から30日、最大5回まで再ダウンロードできます。</p>
      {items.length === 0 ? (
        <p>購入済み商品はまだありません。</p>
      ) : (
        <ul>
          {items.map((item) => {
            const product = getProductBySlug(item.productSlug);
            const grant = getDownloadGrantByOrderItem(item.id, userId) ??
              issueDownloadGrant({ orderItemId: item.id, userId }).grant;
            const remainingCount = getRemainingDownloadCount(item.id, userId);

            return (
              <li key={item.id}>
                {product?.name ?? item.productSlug} / 数量: {item.quantity} / 残回数: {remainingCount}/
                {grant.maxDownloadCount} / 期限: {new Date(grant.expiresAt).toLocaleDateString('ja-JP')} /{' '}
                <Link href={`/mypage/library/${item.id}`}>ダウンロードURLを発行</Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
