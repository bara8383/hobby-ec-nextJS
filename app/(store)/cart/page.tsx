import type { Metadata } from 'next';
import { CartContent } from '@/components/cart/CartContent';

export const metadata: Metadata = {
  title: 'カート',
  description: '購入予定のデジタル商品を確認するページです。',
  alternates: {
    canonical: '/cart'
  }
};

export default function CartPage() {
  return (
    <main>
      <h1>カート</h1>
      <CartContent />
    </main>
  );
}
