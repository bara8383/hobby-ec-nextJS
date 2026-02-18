import type { Metadata } from 'next';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { Section } from '@/components/ui/Section';

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
      <Section title="チェックアウト" description="注文内容を確認し、購入を確定します。">
        <CheckoutContent />
      </Section>
    </main>
  );
}
