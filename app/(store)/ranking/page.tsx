import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';
import { buildRankingMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildRankingMetadata();

const rankingProducts = [...products]
  .map((product, index) => ({
    product,
    rank: index + 1,
    score: Math.round((product.priceJpy / 100) * 7 + product.tags.length * 11)
  }))
  .sort((a, b) => b.score - a.score);

export default function RankingPage() {
  return (
    <main>
      <Breadcrumbs
        items={[
          { name: 'ホーム', path: '/' },
          { name: '人気ランキング', path: '/ranking' }
        ]}
      />

      <h1>人気ランキング</h1>
      <p className="section-description">
        有名ECで定番のランキング導線を追加し、人気順で商品を比較しやすくしました。検索前の入口として活用できます。
      </p>

      <section className="ranking-list" aria-label="人気ランキング一覧">
        {rankingProducts.map(({ product, rank, score }) => (
          <article key={product.id} className="ranking-list-item">
            <div className="ranking-meta">
              <p className="ranking-order">#{rank}</p>
              <p className="hub-meta">人気スコア: {score}</p>
              <Link href={`/products/${product.slug}`}>商品詳細を見る</Link>
            </div>
            <ProductCard product={product} />
          </article>
        ))}
      </section>
    </main>
  );
}
