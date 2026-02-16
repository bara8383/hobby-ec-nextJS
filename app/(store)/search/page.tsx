import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { searchProducts } from '@/data/products';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export const metadata: Metadata = {
  title: '検索結果',
  description: 'サイト内検索結果ページです。',
  robots: {
    index: false,
    follow: true
  }
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = readValue(params.q) ?? '';

  const items = searchProducts({ query: q, sort: 'newest' });

  return (
    <main>
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
