import type { Metadata } from 'next';
import { CartContent } from '@/components/cart/CartContent';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = {
  title: 'カート',
  description: '購入予定のデジタル商品を確認するページです。',
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: '/cart'
  }
};

export default function CartPage() {
  return (
    <main>
      <Section title="カート" description="購入予定の商品と数量を確認し、チェックアウトへ進めます。">
        <CartContent />
      </Section>
    </main>
  );
}
