'use client';

import { type FormEvent, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = {
  initialQuery?: string;
};

export function HomeKeywordSearchBar({ initialQuery = '' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    const q = String(formData.get('q') ?? '').trim();

    if (q) {
      params.set('q', q);
    } else {
      params.delete('q');
    }

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  return (
    <form className="home-search" onSubmit={onSubmit} aria-label="ホーム商品キーワード検索フォーム">
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
