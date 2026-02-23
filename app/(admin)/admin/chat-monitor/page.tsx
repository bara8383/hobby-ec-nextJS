import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/auth/demo-session';
import { listConversations, listConversationMessages } from '@/lib/chat/repository';

export const metadata: Metadata = {
  title: '管理: チャット監視',
  robots: { index: false, follow: false }
};

export default async function AdminChatMonitorPage() {
  await requireRole('admin');
  const conversations = listConversations();

  return (
    <main>
      <h1>管理画面: チャット監視</h1>
      <p>出品者と購入希望者の会話を監視し、必要時に介入できます。</p>
      {conversations.length === 0 ? <p>まだ会話はありません。</p> : null}
      <ul>
        {await Promise.all(
          conversations.map(async (conversation) => {
            const history = await listConversationMessages({ conversationId: conversation.conversationId, limit: 5 });
            return (
              <li key={conversation.conversationId}>
                <p>
                  <strong>{conversation.conversationId}</strong> / 参加者: {conversation.participants.join(', ')} /{' '}
                  <Link href={`/chat?conversationId=${conversation.conversationId}`}>会話ページを開く</Link>
                </p>
                <ul>
                  {history.messages.map((message) => (
                    <li key={message.messageId}>
                      {new Date(message.createdAt).toLocaleString('ja-JP')} / {message.senderId}: {message.body}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })
        )}
      </ul>
    </main>
  );
}
