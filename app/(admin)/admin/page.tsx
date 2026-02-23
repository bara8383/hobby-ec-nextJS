import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/auth/demo-session';

export const metadata: Metadata = {
  title: '管理者ダッシュボード',
  description: '運営向けの注文・商品・チャット監視ページです。',
  robots: { index: false, follow: false },
  alternates: { canonical: '/admin' }
};

export default async function AdminDashboardPage() {
  const user = await requireRole('admin');

  return (
    <main>
      <h1>管理者ダッシュボード</h1>
      <p>ようこそ {user.displayName} さん。運営の監視と対応をここで行います。</p>
      <ul>
        <li><Link href="/admin/orders">注文監視</Link></li>
        <li><Link href="/admin/products">商品監視</Link></li>
        <li><Link href="/admin/chat-monitor">チャット監視</Link></li>
      </ul>
    </main>
  );
}
