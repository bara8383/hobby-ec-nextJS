import Link from 'next/link';
import { buildHelpMetadata } from '@/lib/seo/metadata';

export const metadata = buildHelpMetadata();

const helpLinks = [
  {
    title: '注文について',
    description: '注文履歴・注文詳細・決済状況の確認方法を案内します。',
    href: '/mypage/orders'
  },
  {
    title: '配送・ダウンロードについて',
    description: 'デジタル商品のダウンロード手順や再取得方法を確認できます。',
    href: '/mypage/library'
  },
  {
    title: '支払いについて',
    description: '利用可能な支払い方法と請求タイミングを案内します。',
    href: '/legal/tokushoho'
  },
  {
    title: '返品・キャンセルについて',
    description: '返品ポリシーおよび問い合わせ前の確認事項をまとめています。',
    href: '/legal/terms'
  },
  {
    title: 'アカウントについて',
    description: 'プロフィール・通知・セキュリティ設定の変更手順です。',
    href: '/mypage/settings'
  }
];

export default function HelpPage() {
  return (
    <main>
      <h1>ヘルプセンター</h1>
      <p className="section-description">カテゴリ別にサポート情報へアクセスできます。</p>
      <section className="hub-grid" aria-label="ヘルプ導線">
        {helpLinks.map((link) => (
          <article key={link.title} className="hub-card">
            <h2>
              <Link href={link.href}>{link.title}</Link>
            </h2>
            <p>{link.description}</p>
          </article>
        ))}
      </section>

      <section className="chat-cta-band" aria-label="ヘルプからチャットへの導線">
        <h2>解決しない場合はチャットへ</h2>
        <p>注文内容を確認しながらリアルタイムでご案内します。</p>
        <Link className="button-link" href="/chat">
          チャットページへ
        </Link>
      </section>
    </main>
  );
}
