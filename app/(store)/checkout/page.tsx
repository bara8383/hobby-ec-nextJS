import type { Metadata } from 'next';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';

export const metadata: Metadata = {
  title: 'チェックアウト',
  description: '注文内容の確認と購入確定を行うページです。',
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: '/checkout'
  }
};

export default function CheckoutPage() {
  return (
    <main>
      <h1>チェックアウト</h1>
      <CheckoutContent />
    </main>
  );
}
