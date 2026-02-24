import type { Metadata } from 'next';
import { SkipLink } from '@/components/a11y/SkipLink';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
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
        <SkipLink />
        <SiteHeader currentUser={currentUser} />

        <main id="main">{children}</main>

        <SiteFooter />
      </body>
    </html>
  );
}
