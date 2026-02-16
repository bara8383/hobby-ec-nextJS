import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';

export const metadata: Metadata = {
  title: '検索結果',
  description: 'サイト内検索結果ページです。',
  robots: {
    index: false,
    follow: true
  }
};

export default function SearchPage() {
  return (
    <main>
      <h1>検索結果</h1>
      <p>デモ実装として全商品を表示しています。今後クエリ連動の検索UIを追加予定です。</p>
      <section className="grid" aria-label="検索結果商品一覧">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}
