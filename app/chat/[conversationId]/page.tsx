import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LineLikeChat } from '@/components/chat/LineLikeChat';
import { Section } from '@/components/ui/Section';
import { getCurrentUser } from '@/lib/auth/demo-session';
import { getProductById } from '@/lib/db/repositories/product-repository';
import { findConversation, isParticipant } from '@/lib/chat/core/store';

type Params = { params: Promise<{ conversationId: string }> };

export default async function ConversationPage({ params }: Params) {
  const user = await getCurrentUser();
  const { conversationId } = await params;
  const conversation = findConversation(conversationId);

  if (!conversation || !isParticipant(conversation, user.id)) {
    notFound();
  }

  const productSlug = conversation.productSlug ?? (conversation.productId ? getProductById(conversation.productId)?.slug : undefined);

  return (
    <main>
      <Section title="会話" description={`会話ID: ${conversation.id}`}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/chat">チャット一覧へ戻る</Link>
          {productSlug ? <Link href={`/products/${productSlug}`}>商品詳細へ戻る</Link> : null}
        </div>
      </Section>
      <LineLikeChat conversationId={conversation.id} currentUserId={user.id} />
    </main>
  );
}
