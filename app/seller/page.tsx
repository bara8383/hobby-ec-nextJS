import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/auth/demo-session';
import { listSellerListings, listSoldItemsForSeller } from '@/lib/db/repositories/seller-repository';

export const metadata: Metadata = {
  title: '出品者ページ',
  description: '出品物の管理と販売後の確認を行うページです。',
  robots: { index: false, follow: false },
  alternates: { canonical: '/seller' }
};

export default async function SellerPage() {
  const user = await requireRole('seller');
  const listings = listSellerListings(user.id);
  const sold = listSoldItemsForSeller(user.id);

  return (
    <main>
      <h1>出品者管理</h1>
      <p>出品中の商品管理と、購入後のフォロー対応を行います。</p>

      <section>
        <h2>出品中の商品</h2>
        {listings.length === 0 ? <p>出品中の商品はありません。</p> : null}
        <ul>
          {listings.map((item) => (
            <li key={item.id}>
              {item.name} / ¥{item.priceJpy.toLocaleString('ja-JP')} / <Link href={`/products/${item.slug}`}>商品ページ</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>販売済み対応</h2>
        {sold.length === 0 ? <p>まだ販売はありません。</p> : null}
        <ul>
          {sold.map(({ order, item }) => (
            <li key={item.id}>
              注文 {order.id} / {item.productNameSnapshot} / 数量 {item.quantity} / 
              <Link href={`/chat?conversationId=order-${order.id}`}>購入者とチャット</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
