import type { Metadata } from 'next';
import Link from 'next/link';
import { listOrderItemsByOrderId, listOrdersByUser } from '@/lib/db/repositories/order-repository';

export const metadata: Metadata = {
  title: '注文履歴',
  description: '注文単位で購入履歴を確認できるマイページです。',
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: '/mypage/orders'
  }
};

function formatDate(value?: string) {
  if (!value) return '不明';
  return new Date(value).toLocaleDateString('ja-JP');
}

export default function OrdersPage() {
  const userId = 'user-demo';
  const orders = listOrdersByUser(userId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <main>
      <h1>注文履歴</h1>
      <p className="section-description">注文単位で購入履歴を確認できます。詳細ページからチャット相談へ進めます。</p>
      {orders.length === 0 ? (
        <p>注文履歴はまだありません。商品一覧から購入をお試しください。</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => {
            const items = listOrderItemsByOrderId(order.id);
            const summary = items
              .slice(0, 2)
              .map((item) => item.productNameSnapshot ?? item.productSlug)
              .join(' / ');

            return (
              <li key={order.id} className="order-card">
                <div>
                  <p className="order-card-id">注文ID: {order.id}</p>
                  <p>注文日: {formatDate(order.orderedAt ?? order.createdAt)}</p>
                  <p>合計金額: ¥{order.totalJpy.toLocaleString('ja-JP')}</p>
                  <p>ステータス: {order.status}</p>
                  <p>主要アイテム: {summary || 'なし'}</p>
                </div>
                <Link href={`/mypage/orders/${order.id}`}>注文詳細を見る</Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
