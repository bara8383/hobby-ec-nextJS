import type { Metadata } from 'next';
import { LineLikeChat } from '@/components/chat/LineLikeChat';
import { Section } from '@/components/ui/Section';
import { getCurrentUser } from '@/lib/auth/demo-session';
import { ensureConversation } from '@/lib/chat/in-memory-chat-store';

export const metadata: Metadata = {
  title: 'チャット相談',
  description: '1対1チャットで購入前後の相談ができます。',
  robots: { index: false, follow: false }
};

export default async function ChatPage() {
  const user = await getCurrentUser();
  const partnerId = user.id === 'seller-demo' ? 'buyer-demo' : 'seller-demo';
  const conversation = ensureConversation(user.id, partnerId);

  return (
    <main>
      <Section title="リアルタイムチャット" description="SSEで新着・既読を即時反映する最小実装です。">
        <p className="hero-label">会話ID: {conversation.id}</p>
      </Section>
      <LineLikeChat conversationId={conversation.id} currentUserId={user.id} />
    </main>
  );
}
