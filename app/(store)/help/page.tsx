import Link from 'next/link';
import { buildHelpMetadata } from '@/lib/seo/metadata';

export const metadata = buildHelpMetadata();

const helpLinks = [
  {
    title: '商品の選び方',
    description: 'カテゴリ、タグ、価格帯から用途に合う商品を探す方法です。',
    href: '/products'
  },
  {
    title: 'ライセンス確認',
    description: '商用利用や再配布可否を商品ページのライセンス表記で確認できます。',
    href: '/faq'
  },
  {
    title: '支払いと提供時期',
    description: '決済方法、請求タイミング、ダウンロード提供時期を確認できます。',
    href: '/legal/tokushoho'
  },
  {
    title: '返品・キャンセル',
    description: 'デジタル商品の返品条件と利用規約を確認できます。',
    href: '/legal/terms'
  },
  {
    title: '個人情報と問い合わせ',
    description: '個人情報の取り扱いと問い合わせ窓口の案内です。',
    href: '/contact'
  }
];

export default function HelpPage() {
  return (
    <main>
      <h1>ヘルプセンター</h1>
      <p className="section-description">購入前後に必要な情報を、公開ページ単位で確認できるよう整理しています。</p>
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
