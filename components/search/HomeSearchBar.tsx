'use client';

import { type FormEvent, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PRODUCT_CATEGORIES, getCategoryLabel } from '@/data/products';

type Props = {
  initialQuery?: string;
  initialCategory?: string;
  initialSort?: string;
};

export function HomeSearchBar({ initialQuery = '', initialCategory = '', initialSort = 'new' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    const q = String(formData.get('q') ?? '').trim();
    const category = String(formData.get('category') ?? '').trim();
    const sort = String(formData.get('sort') ?? '').trim();

    if (q) {
      params.set('q', q);
    } else {
      params.delete('q');
    }

    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    if (sort && sort !== 'new') {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  return (
    <form className="home-search" onSubmit={onSubmit} aria-label="ホーム商品検索フォーム">
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

        <label className="home-search-field">
          <span>カテゴリ</span>
          <select className="ui-select" name="category" defaultValue={initialCategory}>
            <option value="">すべて</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </select>
        </label>

        <label className="home-search-field">
          <span>並び順</span>
          <select className="ui-select" name="sort" defaultValue={initialSort}>
            <option value="new">新着順</option>
            <option value="price_asc">価格が安い順</option>
            <option value="price_desc">価格が高い順</option>
          </select>
        </label>

        <button className="ui-button ui-button--primary" type="submit" disabled={isPending} aria-label="検索を実行">
          検索
        </button>
      </div>

      {isPending ? <p className="home-search-status">検索条件を反映中です...</p> : null}
    </form>
  );
}
