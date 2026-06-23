import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import {
  PRODUCT_CATEGORIES,
  getCategoryLabel,
  searchProducts,
  type DigitalCategory,
  type ProductSearchFilters
} from '@/data/products';
import { buildSearchMetadata } from '@/lib/seo/metadata';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const FILTER_KEYS = ['q', 'category', 'tag', 'priceMin', 'priceMax', 'sort'] as const;
const SORT_LABELS: Record<NonNullable<ProductSearchFilters['sort']>, string> = {
  newest: '新着順',
  price_asc: '価格の安い順',
  price_desc: '価格の高い順'
};

function readValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePrice(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function parseSort(value: string | undefined): ProductSearchFilters['sort'] {
  return value === 'price_asc' || value === 'price_desc' || value === 'newest' ? value : 'newest';
}

function parseFilters(params: Record<string, string | string[] | undefined>): ProductSearchFilters {
  return {
    query: readValue(params.q)?.trim() || undefined,
    category: readValue(params.category)?.trim() || undefined,
    tag: readValue(params.tag)?.trim() || undefined,
    priceMin: parsePrice(readValue(params.priceMin)),
    priceMax: parsePrice(readValue(params.priceMax)),
    sort: parseSort(readValue(params.sort))
  };
}

function hasSearchParameters(params: Record<string, string | string[] | undefined>) {
  return FILTER_KEYS.some((key) => Boolean(readValue(params[key])?.trim()));
}

function buildSearchCanonical(filters: ProductSearchFilters) {
  const query = new URLSearchParams();

  if (filters.query) {
    query.set('q', filters.query);
  }

  if (filters.category) {
    query.set('category', filters.category);
  }

  if (filters.tag) {
    query.set('tag', filters.tag);
  }

  if (typeof filters.priceMin === 'number') {
    query.set('priceMin', String(filters.priceMin));
  }

  if (typeof filters.priceMax === 'number') {
    query.set('priceMax', String(filters.priceMax));
  }

  if (filters.sort && filters.sort !== 'newest') {
    query.set('sort', filters.sort);
  }

  return query.toString() ? `/search?${query.toString()}` : '/search';
}

function buildActiveFilterLabels(filters: ProductSearchFilters) {
  const labels: string[] = [];

  if (filters.query) {
    labels.push(`キーワード「${filters.query}」`);
  }

  if (filters.category) {
    const category = filters.category as DigitalCategory;
    const categoryLabel = PRODUCT_CATEGORIES.includes(category) ? getCategoryLabel(category) : filters.category;
    labels.push(`カテゴリ「${categoryLabel}」`);
  }

  if (filters.tag) {
    labels.push(`タグ「${filters.tag}」`);
  }

  if (typeof filters.priceMin === 'number') {
    labels.push(`${filters.priceMin.toLocaleString('ja-JP')}円以上`);
  }

  if (typeof filters.priceMax === 'number') {
    labels.push(`${filters.priceMax.toLocaleString('ja-JP')}円以下`);
  }

  labels.push(`並び替え「${SORT_LABELS[filters.sort ?? 'newest']}」`);

  return labels;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;

  const filters = parseFilters(params);

  return buildSearchMetadata(buildSearchCanonical(filters), {
    robots: hasSearchParameters(params) ? { index: false, follow: true } : undefined
  });
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const canonical = buildSearchCanonical(filters);
  const activeFilterLabels = buildActiveFilterLabels(filters);

  const items = searchProducts(filters);

  return (
    <main>
      <Breadcrumbs
        items={[
          { name: 'ホーム', path: '/' },
          { name: '検索', path: canonical }
        ]}
      />
      <section className="search-results-hero" aria-labelledby="search-results-title">
        <p className="hero-label">SEARCH RESULTS</p>
        <h1 id="search-results-title">{filters.query ? `「${filters.query}」の検索結果` : '検索結果'}</h1>
        <p className="products-count">該当 {items.length} 件</p>
        <ul className="active-filter-list" aria-label="適用中の検索条件">
          {activeFilterLabels.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </section>
      {items.length === 0 ? (
        <p className="empty-state">条件に一致する商品がありません。キーワードや価格などの検索条件を調整してください。</p>
      ) : (
        <section className="grid" aria-label="検索結果商品一覧">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}
