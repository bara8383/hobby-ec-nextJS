import type { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ orderId?: string }>;
};

export const metadata: Metadata = {
  title: '購入完了',
  description: 'デジタル商品の購入完了ページです。',
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: '/checkout/success'
  }
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <main>
      <h1>購入ありがとうございました</h1>
      <p>注文番号: {params.orderId ?? '不明'}</p>
      <p>ダウンロードは購入済みライブラリから再取得できます。</p>
      <Link href="/mypage/library">購入済みライブラリへ</Link>
    </main>
  );
}
