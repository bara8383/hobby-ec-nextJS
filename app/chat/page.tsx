import type { Metadata } from 'next';
import { ChatWidget } from '@/components/ChatWidget';
import { Section } from '@/components/ui/Section';
import { getCurrentUser } from '@/lib/auth/demo-session';

export const metadata: Metadata = {
  title: 'チャット相談',
  description: '出品者・購入者・管理者の会話をリアルタイムに確認できます。',
  robots: { index: false, follow: false }
};

export default async function ChatPage({
  searchParams
}: {
  searchParams: Promise<{ conversationId?: string; message?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const conversationId = params.conversationId?.trim() || 'buyer-support';
  const preset = params.message ?? '';

  return (
    <main>
      <Section
        className="hero"
        title="リアルタイムチャット"
        description="居心地の良さを優先した、購入前後の相談チャットです。"
      >
        <p className="hero-label">会話ID: {conversationId}</p>
      </Section>
      <ChatWidget initialMessage={preset} conversationId={conversationId} currentUserId={user.id} />
    </main>
  );
}
