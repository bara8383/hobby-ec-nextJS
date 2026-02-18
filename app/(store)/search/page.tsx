import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { searchProducts } from '@/data/products';
import { buildSearchMetadata } from '@/lib/seo/metadata';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildSearchCanonical(params: Record<string, string | string[] | undefined>) {
  const q = readValue(params.q);

  if (!q) {
    return '/search';
  }

  const query = new URLSearchParams({ q });
  return `/search?${query.toString()}`;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;

  return buildSearchMetadata(buildSearchCanonical(params));
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = readValue(params.q) ?? '';
  const canonical = buildSearchCanonical(params);

  const items = searchProducts({ query: q, sort: 'newest' });

  return (
    <main>
      <Breadcrumbs
        items={[
          { name: 'ホーム', path: '/' },
          { name: '検索', path: canonical }
        ]}
      />
      <h1>検索結果</h1>
      <p>キーワード: {q || '未入力'}</p>
      {items.length === 0 ? (
        <p>検索結果がありませんでした。別キーワードをお試しください。</p>
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
