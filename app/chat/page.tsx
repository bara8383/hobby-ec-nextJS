import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { getCurrentUser } from '@/lib/auth/demo-session';
import { getProductById } from '@/lib/db/repositories/product-repository';
import { getUserById } from '@/lib/db/repositories/user-repository';
import {
  createConversation,
  findConversationByProduct,
  listConversationsByUser,
  listMessages,
  participants
} from '@/lib/chat/core/store';

export const metadata: Metadata = {
  title: 'チャット一覧',
  description: '会話一覧から商品ごとの相談チャットにアクセスできます。',
  robots: { index: false, follow: false }
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('ja-JP', { hour12: false });
}

export default async function ChatListPage({
  searchParams
}: {
  searchParams: Promise<{ new?: string; productId?: string; conversationId?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;

  if (params.conversationId) {
    redirect(`/chat/${params.conversationId}`);
  }

  if (params.new === '1' && params.productId) {
    const existing = findConversationByProduct(user.id, params.productId);
    if (existing) {
      redirect(`/chat/${existing.id}`);
    }

    const product = getProductById(params.productId);
    const conversation = createConversation({
      userId: user.id,
      productId: params.productId,
      productSlug: product?.slug
    });
    redirect(`/chat/${conversation.id}`);
  }

  const conversations = listConversationsByUser(user.id);

  return (
    <main>
      <Section title="チャット一覧" description="商品に紐づく会話を選択して相談を続けられます。">
        {conversations.length === 0 ? (
          <p className="hero-label">会話はまだありません。商品ページから新規相談を開始してください。</p>
        ) : (
          <ul style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}>
            {conversations.map((conversation) => {
              const lastMessage = listMessages(conversation.id, null, 1).messages[0] ?? null;
              const partnerId = participants(conversation).find((id) => id !== user.id) ?? user.id;
              const partnerName = getUserById(partnerId)?.displayName ?? partnerId;

              return (
                <li key={conversation.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                  <Link href={`/chat/${conversation.id}`} style={{ display: 'grid', gap: 6, textDecoration: 'none' }}>
                    <strong>{partnerName}</strong>
                    <span>最終メッセージ: {lastMessage?.text.slice(0, 80) ?? ''}</span>
                    <span>最終更新: {formatDateTime(conversation.updatedAt)}</span>
                    {conversation.productId ? <span>商品ID: {conversation.productId}</span> : null}
                  </Link>
                  {conversation.productSlug ? (
                    <Link href={`/products/${conversation.productSlug}`}>商品詳細へ</Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </main>
  );
}
