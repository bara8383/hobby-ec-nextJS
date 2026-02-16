'use client';

import { useState } from 'react';

type DownloadPayload = {
  url: string;
  expiresAt: number;
  remainingCount: number;
  maxDownloadCount: number;
  consumedCount: number;
  grantExpiresAt: string;
};

export function DownloadLinkPanel({ orderItemId }: { orderItemId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<DownloadPayload | null>(null);

  async function issueLink() {
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/downloads/${orderItemId}`);
    const body = (await response.json()) as DownloadPayload | { error: string };

    if (!response.ok) {
      setPayload(null);
      setError('error' in body ? body.error : 'download link issue failed');
      setLoading(false);
      return;
    }

    setPayload(body as DownloadPayload);
    setLoading(false);
  }

  return (
    <section>
      <button type="button" onClick={issueLink} disabled={loading}>
        {loading ? '発行中...' : 'ダウンロードURLを発行'}
      </button>

      {error ? <p className="error">{error}</p> : null}

      {payload ? (
        <div>
          <p>URL有効期限: {new Date(payload.expiresAt).toLocaleString('ja-JP')}</p>
          <p>
            ダウンロード残回数: {payload.remainingCount}/{payload.maxDownloadCount}
          </p>
          <a href={payload.url}>ダウンロード開始</a>
        </div>
      ) : null}
    </section>
  );
}
