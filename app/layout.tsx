import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Container } from '@/components/ui/Container';
import { getCurrentUser } from '@/lib/auth/demo-session';
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

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="ja">
      <body>
        <SiteHeader currentUser={currentUser} />

        {children}

        <footer className="site-footer" aria-label="サイトフッター">
          <Container className="site-footer-inner">
            <p>© {new Date().getFullYear()} Digital Creator Market</p>
            <nav aria-label="フッターナビゲーション">
              <Link href="/legal/tokushoho">特定商取引法に基づく表記</Link>
              <Link href="/legal/terms">利用規約</Link>
              <Link href="/legal/privacy">プライバシーポリシー</Link>
              <Link href="/contact">お問い合わせ</Link>
            </nav>
          </Container>
        </footer>
      </body>
    </html>
  );
}
