import Link from 'next/link';
import { ChatWidget } from '@/components/ChatWidget';
import { ProductCard } from '@/components/ProductCard';
import { allTags, getCategoryLabel, PRODUCT_CATEGORIES, products } from '@/data/products';

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Digital Creator Market',
        url: 'https://example.com'
      },
      {
        '@type': 'WebSite',
        name: 'Digital Creator Market',
        url: 'https://example.com'
      }
    ]
  };

  return (
    <main>
      <section className="hero">
        <h1>Digital Creator Market</h1>
        <p>
          壁紙・イラスト・写真・デジタル音源を扱うデジタルコンテンツ販売ECです。商品詳細のSEOを強化し、購入前の質問はリアルタイムチャットで即時対応できます。
        </p>
      </section>

      <section className="quick-links" aria-label="カテゴリ導線">
        {PRODUCT_CATEGORIES.map((category) => (
          <Link key={category} href={`/categories/${category}`}>
            {getCategoryLabel(category)}
          </Link>
        ))}
      </section>

      <h2>新着商品</h2>
      <section className="grid" aria-label="新着商品一覧">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      <h2>人気タグ</h2>
      <section className="quick-links" aria-label="タグ導線">
        {allTags.map((tag) => (
          <Link key={tag} href={`/tags/${tag}`}>
            #{tag}
          </Link>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ChatWidget />
    </main>
  );
}
