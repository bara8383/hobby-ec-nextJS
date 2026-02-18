import type { Metadata } from 'next';
import { ChatWidget } from '@/components/ChatWidget';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = {
  title: '購入前チャット相談',
  description: '購入前の不明点をスタッフにチャットで相談できます。'
};

export default async function ChatPage({
  searchParams
}: {
  searchParams: Promise<{ orderId?: string; message?: string }>;
}) {
  const params = await searchParams;
  const preset = params.message ?? (params.orderId ? `注文ID: ${params.orderId}\nお問い合わせ内容: ` : '');

  return (
    <main>
      <Section
        className="hero"
        title="リアルタイムチャット相談"
        description="在庫やライセンス範囲の質問を、SSEベースのセミリアルタイムチャットで受け付けています。"
      >
        <p className="hero-label">購入前サポート</p>
        {params.orderId ? <p>注文ID: {params.orderId} の問い合わせテンプレートを入力済みです。</p> : null}
      </Section>
      <ChatWidget initialMessage={preset} />
    </main>
  );
}
