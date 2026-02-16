import type { Metadata } from 'next';
import { listOrders } from '@/lib/db/repositories/order-repository';

export const metadata: Metadata = {
  title: '管理: 注文一覧',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminOrdersPage() {
  const orders = listOrders();

  return (
    <main>
      <h1>管理画面: 注文一覧</h1>
      {orders.length === 0 ? (
        <p>注文はまだありません。</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.id} / {order.status} / ¥{order.totalJpy.toLocaleString('ja-JP')} / {order.createdAt}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
