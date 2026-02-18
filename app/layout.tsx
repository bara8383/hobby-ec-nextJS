import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Digital Creator Market',
    template: '%s | Digital Creator Market'
  },
  description:
    '壁紙・写真・イラスト・デジタル音楽を販売する、Next.js App RouterベースのデジタルECサイト。',
  keywords: ['デジタル商品', '壁紙', '写真素材', 'イラスト素材', 'BGM', 'ECサイト'],
  openGraph: {
    title: 'Digital Creator Market',
    description: 'デジタルダウンロード商品を扱うSEO最適化済みECサイト',
    type: 'website'
  },
  alternates: {
    canonical: '/'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <header className="site-header" aria-label="サイトヘッダー">
          <div className="site-header-inner">
            <Link href="/" className="site-logo">
              Digital Creator Market
            </Link>
            <nav aria-label="主要ナビゲーション" className="site-nav">
              <Link href="/products">商品一覧</Link>
              <Link href="/search">条件検索</Link>
              <Link href="/categories">カテゴリ</Link>
              <Link href="/tags">タグ</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/help">ヘルプ</Link>
              <Link href="/mypage/library">購入済みライブラリ</Link>
              <Link href="/mypage/orders">注文履歴</Link>
              <Link href="/mypage/settings">アカウント設定</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer" aria-label="サイトフッター">
          <div className="site-footer-inner">
            <p>© {new Date().getFullYear()} Digital Creator Market</p>
            <nav aria-label="フッターナビゲーション">
              <Link href="/legal/tokushoho">特定商取引法に基づく表記</Link>
              <Link href="/legal/terms">利用規約</Link>
              <Link href="/legal/privacy">プライバシーポリシー</Link>
              <Link href="/contact">お問い合わせ</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
