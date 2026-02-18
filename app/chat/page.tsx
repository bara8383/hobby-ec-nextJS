import type { Metadata } from 'next';
import { ChatWidget } from '@/components/ChatWidget';

export const metadata: Metadata = {
  title: '購入前チャット相談',
  description: '購入前の不明点をスタッフにチャットで相談できます。'
};

export default function ChatPage() {
  return (
    <main>
      <section className="hero">
        <p className="hero-label">購入前サポート</p>
        <h1>リアルタイムチャット相談</h1>
        <p>在庫やライセンス範囲の質問を、SSEベースのセミリアルタイムチャットで受け付けています。</p>
      </section>
      <ChatWidget />
    </main>
  );
}
