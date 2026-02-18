'use client';

import Link from 'next/link';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main>
      <h1>エラーが発生しました</h1>
      <p className="section-description">
        一時的な問題が発生しています。再試行しても改善しない場合はお問い合わせまたはチャットをご利用ください。
      </p>
      <div className="hero-cta-row">
        <button type="button" onClick={() => reset()}>
          再試行
        </button>
        <Link className="button-link" href="/contact">
          お問い合わせ
        </Link>
        <Link className="button-link button-link-secondary" href="/chat">
          チャット
        </Link>
      </div>
    </main>
  );
}
