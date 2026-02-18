import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';

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
      <Section title="購入ありがとうございました" description="決済が完了しました。購入済みライブラリからいつでも再ダウンロードできます。">
        <Card>
          <p>注文番号: {params.orderId ?? '不明'}</p>
          <ButtonLink href="/mypage/library" variant="secondary">
            購入済みライブラリへ
          </ButtonLink>
        </Card>
      </Section>
    </main>
  );
}
