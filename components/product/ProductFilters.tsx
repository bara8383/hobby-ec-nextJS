'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { allTags, PRODUCT_CATEGORIES, type ProductSearchFilters } from '@/data/products';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

type Props = {
  filters: ProductSearchFilters;
  minPrice: number;
  maxPrice: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function ProductFilters({ filters, minPrice, maxPrice }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState({
    min: clamp(filters.priceMin ?? minPrice, minPrice, maxPrice),
    max: clamp(filters.priceMax ?? maxPrice, minPrice, maxPrice)
  });

  const activePriceChip = useMemo(() => {
    if (priceRange.min === minPrice && priceRange.max === maxPrice) {
      return null;
    }

    return `¥${priceRange.min.toLocaleString('ja-JP')} - ¥${priceRange.max.toLocaleString('ja-JP')}`;
  }, [maxPrice, minPrice, priceRange.max, priceRange.min]);

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

  const applyPriceRange = (nextMin: number, nextMax: number) => {
    const params = createParams();

    if (nextMin > minPrice) {
      params.set('priceMin', String(nextMin));
    } else {
      params.delete('priceMin');
    }

    if (nextMax < maxPrice) {
      params.set('priceMax', String(nextMax));
    } else {
      params.delete('priceMax');
    }

    replaceWithParams(params);
  };

  const handlePriceEnd = () => {
    applyPriceRange(priceRange.min, priceRange.max);
  };

  return (
    <aside className="products-filter-panel" aria-label="商品絞り込み">
      <div className="products-filter-section">
        <label htmlFor="products-query" className="products-filter-heading">
          キーワード
        </label>
        <Input
          id="products-query"
          name="q"
          defaultValue={filters.query ?? ''}
          placeholder="探したい商品を入力"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              updateParam('q', (event.currentTarget as HTMLInputElement).value.trim());
            }
          }}
          onBlur={(event) => updateParam('q', event.currentTarget.value.trim())}
        />
      </div>

      <div className="products-filter-section">
        <label htmlFor="products-category" className="products-filter-heading">
          カテゴリ
        </label>
        <Select
          id="products-category"
          name="category"
          defaultValue={filters.category ?? ''}
          onChange={(event) => updateParam('category', event.currentTarget.value)}
        >
          <option value="">すべて</option>
          {PRODUCT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>

      <div className="products-filter-section">
        <label htmlFor="products-tag" className="products-filter-heading">
          タグ
        </label>
        <Select id="products-tag" name="tag" defaultValue={filters.tag ?? ''} onChange={(event) => updateParam('tag', event.currentTarget.value)}>
          <option value="">すべて</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </Select>
      </div>

      <div className="products-filter-section">
        <p className="products-filter-heading">価格帯</p>
        {activePriceChip ? (
          <button
            type="button"
            className="products-active-chip"
            onClick={() => {
              setPriceRange({ min: minPrice, max: maxPrice });
              applyPriceRange(minPrice, maxPrice);
            }}
          >
            {activePriceChip} ×
          </button>
        ) : null}
        <div className="products-price-range">
          <div className="products-price-track" />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={100}
            value={priceRange.min}
            onChange={(event) => {
              const nextMin = clamp(Number(event.currentTarget.value), minPrice, priceRange.max);
              setPriceRange((prev) => ({ ...prev, min: nextMin }));
            }}
            onMouseUp={handlePriceEnd}
            onTouchEnd={handlePriceEnd}
            aria-label="最小価格"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={100}
            value={priceRange.max}
            onChange={(event) => {
              const nextMax = clamp(Number(event.currentTarget.value), priceRange.min, maxPrice);
              setPriceRange((prev) => ({ ...prev, max: nextMax }));
            }}
            onMouseUp={handlePriceEnd}
            onTouchEnd={handlePriceEnd}
            aria-label="最大価格"
          />
        </div>
        <p className="products-price-value">
          ¥{priceRange.min.toLocaleString('ja-JP')} - ¥{priceRange.max.toLocaleString('ja-JP')}
        </p>
      </div>

      <Button
        type="button"
        variant="ghost"
        className="products-filter-reset"
        onClick={() => {
          setPriceRange({ min: minPrice, max: maxPrice });
          router.replace(pathname, { scroll: false });
        }}
      >
        フィルターをクリア
      </Button>
    </aside>
  );
}
