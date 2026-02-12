import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "ホーム",
  description: "壁紙・写真・アイコンを販売する学習用デジタル素材ECサイト",
  path: "/",
  image: "https://example.com/og/home.jpg"
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
