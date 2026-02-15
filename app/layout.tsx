import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Hobby EC Store',
    template: '%s | Hobby EC Store'
  },
  description: 'Next.js App Routerで構築した、SEO対応のミニECサイトデモ。',
  openGraph: {
    title: 'Hobby EC Store',
    description: 'SEO・リアルタイムチャット・AWS低コスト運用を意識したECデモ',
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
      <body>{children}</body>
    </html>
  );
}
