import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <h1>ページが見つかりません</h1>
      <p className="section-description">
        URLが変更されたか、削除された可能性があります。以下の主要導線からお探しのページをご確認ください。
      </p>
      <div className="quick-links" aria-label="404主要導線">
        <Link href="/">トップ</Link>
        <Link href="/products">商品一覧</Link>
        <Link href="/categories">カテゴリ一覧</Link>
        <Link href="/search">検索</Link>
        <Link href="/chat">チャット</Link>
      </div>
    </main>
  );
}
