'use client';

import { type FormEvent, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialQuery?: string;
};

export function HomeKeywordSearchBar({ initialQuery = '' }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const q = String(formData.get('q') ?? '').trim();
    const query = new URLSearchParams();

    if (q) {
      query.set('q', q);
    }

    const nextUrl = query.toString() ? `/search?${query.toString()}` : '/search';

    startTransition(() => {
      router.push(nextUrl);
    });
  };

  return (
    <form className="home-search" action="/search" method="get" onSubmit={onSubmit} aria-label="ホーム商品キーワード検索フォーム">
      <div className="home-search-row">
        <label className="home-search-field">
          <span>キーワード</span>
          <input
            className="ui-input"
            type="search"
            name="q"
            aria-label="商品検索キーワード"
            defaultValue={initialQuery}
            placeholder="商品名やキーワードで検索"
            enterKeyHint="search"
          />
        </label>

        <button className="ui-button ui-button--primary" type="submit" disabled={isPending} aria-label="検索を実行">
          検索
        </button>
      </div>

      {isPending ? <p className="home-search-status">検索条件を反映中です...</p> : null}
    </form>
  );
}
