'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { allTags, getCategoryLabel, PRODUCT_CATEGORIES } from '@/data/products';

type Props = {
  category?: string;
  tag?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc';
};

export function HomeFilterSidebar({ category = '', tag = '', priceMin, priceMax, sort = 'newest' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createParams = () => new URLSearchParams(searchParams.toString());

  const replaceWithParams = (params: URLSearchParams) => {
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const updateParam = (name: string, value: string) => {
    const params = createParams();

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    replaceWithParams(params);
  };

  const updatePriceParam = (name: 'priceMin' | 'priceMax', rawValue: string) => {
    const normalized = rawValue.trim();

    if (!normalized) {
      updateParam(name, '');
      return;
    }

    const numericValue = Number(normalized);

    if (!Number.isFinite(numericValue) || numericValue < 0) {
      updateParam(name, '');
      return;
    }

    updateParam(name, String(Math.floor(numericValue)));
  };

  const clearAllFilters = () => {
    const params = createParams();
    ['q', 'category', 'tag', 'priceMin', 'priceMax', 'sort'].forEach((name) => params.delete(name));
    replaceWithParams(params);
  };

  return (
    <aside className="products-filter-panel" aria-label="ホーム商品絞り込み">
      <div className="products-filter-section">
        <label htmlFor="home-filter-category" className="products-filter-heading">
          カテゴリ
        </label>
        <Select id="home-filter-category" name="category" value={category} onChange={(event) => updateParam('category', event.currentTarget.value)}>
          <option value="">すべて</option>
          {PRODUCT_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {getCategoryLabel(option)}
            </option>
          ))}
        </Select>
      </div>

      <div className="products-filter-section">
        <label htmlFor="home-filter-tag" className="products-filter-heading">
          タグ
        </label>
        <Select id="home-filter-tag" name="tag" value={tag} onChange={(event) => updateParam('tag', event.currentTarget.value)}>
          <option value="">すべて</option>
          {allTags.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div className="products-filter-section">
        <p className="products-filter-heading">価格帯</p>
        <Input
          id="home-filter-price-min"
          name="priceMin"
          type="number"
          min={0}
          inputMode="numeric"
          defaultValue={priceMin ?? ''}
          placeholder="最低価格"
          onBlur={(event) => updatePriceParam('priceMin', event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              updatePriceParam('priceMin', event.currentTarget.value);
            }
          }}
        />
        <Input
          id="home-filter-price-max"
          name="priceMax"
          type="number"
          min={0}
          inputMode="numeric"
          defaultValue={priceMax ?? ''}
          placeholder="最高価格"
          onBlur={(event) => updatePriceParam('priceMax', event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              updatePriceParam('priceMax', event.currentTarget.value);
            }
          }}
        />
      </div>

      <div className="products-filter-section">
        <label htmlFor="home-filter-sort" className="products-filter-heading">
          並び順
        </label>
        <Select id="home-filter-sort" name="sort" value={sort} onChange={(event) => updateParam('sort', event.currentTarget.value)}>
          <option value="newest">新着順</option>
          <option value="price_asc">価格が安い順</option>
          <option value="price_desc">価格が高い順</option>
        </Select>
      </div>

      <Button type="button" variant="ghost" className="products-filter-reset" onClick={clearAllFilters}>
        フィルターをクリア
      </Button>
    </aside>
  );
}
