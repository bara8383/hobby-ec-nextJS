import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LineLikeChat } from '@/components/chat/LineLikeChat';
import { Section } from '@/components/ui/Section';
import { getCurrentUser } from '@/lib/auth/demo-session';
import { findConversation, isParticipant } from '@/lib/chat/core/store';

type Params = { params: Promise<{ conversationId: string }> };

export default async function ConversationPage({ params }: Params) {
  const user = await getCurrentUser();
  const { conversationId } = await params;
  const conversation = findConversation(conversationId);

  if (!conversation || !isParticipant(conversation, user.id)) {
    notFound();
  }

  return (
    <main>
      <Section title="会話" description={`会話ID: ${conversation.id}`}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/chat">チャット一覧へ戻る</Link>
          {conversation.productSlug ? <Link href={`/products/${conversation.productSlug}`}>商品詳細へ戻る</Link> : null}
        </div>
      </Section>
      <LineLikeChat conversationId={conversation.id} currentUserId={user.id} />
    </main>
  );
}
