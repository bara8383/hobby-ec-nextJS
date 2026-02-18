import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderForUser, listOrderItemsByOrderId } from '@/lib/db/repositories/order-repository';

type Props = {
  params: Promise<{ orderId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `注文詳細 ${orderId}`,
    description: '注文内容・金額内訳・問い合わせ導線を確認するページです。',
    robots: {
      index: false,
      follow: false
    },
    alternates: {
      canonical: `/mypage/orders/${orderId}`
    }
  };
}

function formatDate(value?: string) {
  if (!value) return '不明';
  return new Date(value).toLocaleString('ja-JP');
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  const userId = 'user-demo';
  const order = getOrderForUser(orderId, userId);

  if (!order) {
    notFound();
  }

  const items = listOrderItemsByOrderId(order.id);
  const inquiryTemplate = encodeURIComponent(
    `注文ID: ${order.id}\n商品: ${items.map((item) => item.productNameSnapshot ?? item.productSlug).join(', ')}\nお問い合わせ内容: `
  );

  return (
    <main>
      <h1>注文詳細</h1>
      <section className="order-detail-grid" aria-label="注文情報">
        <article className="order-detail-card">
          <h2>注文情報</h2>
          <p>注文ID: {order.id}</p>
          <p>注文日時: {formatDate(order.orderedAt ?? order.createdAt)}</p>
          <p>注文ステータス: {order.status}</p>
          <p>支払い方法: {order.paymentProvider ?? 'クレジットカード（仮）'}</p>
        </article>
        <article className="order-detail-card">
          <h2>金額内訳</h2>
          <p>小計: ¥{(order.subtotalJpy ?? order.totalJpy).toLocaleString('ja-JP')}</p>
          <p>税額: ¥{(order.taxJpy ?? 0).toLocaleString('ja-JP')}</p>
          <p>合計: ¥{order.totalJpy.toLocaleString('ja-JP')}</p>
        </article>
      </section>

      <section className="order-detail-card" aria-label="購入アイテム明細">
        <h2>購入アイテム</h2>
        <ul className="order-item-list">
          {items.map((item) => (
            <li key={item.id}>
              {item.productNameSnapshot ?? item.productSlug} / 数量: {item.quantity} / 単価: ¥
              {item.unitPriceJpy.toLocaleString('ja-JP')}
            </li>
          ))}
        </ul>
      </section>

      <section className="chat-cta-band" aria-label="注文詳細からチャット導線">
        <h2>この注文について相談する</h2>
        <p>注文IDを引き継いでチャット相談に進めます。</p>
        <div className="hero-cta-row">
          <Link className="button-link" href={`/chat?orderId=${order.id}`}>
            注文ID付きでチャットを開く
          </Link>
          <Link className="button-link button-link-secondary" href={`/chat?orderId=${order.id}&message=${inquiryTemplate}`}>
            テンプレ付きで問い合わせる
          </Link>
        </div>
      </section>
    </main>
  );
}
