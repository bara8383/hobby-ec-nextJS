import { ChatWidget } from '@/components/ChatWidget';
import { ProductCard } from '@/components/ProductCard';
import { getCategoryLabel, products } from '@/data/products';

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        sku: product.sku,
        category: getCategoryLabel(product.category),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'JPY',
          price: product.priceJpy
        }
      }
    }))
  };

  return (
    <main>
      <section className="hero">
        <h1>Digital Creator Market</h1>
        <p>
          壁紙、写真、イラスト、デジタル音楽などのダウンロード商品を販売する
          Next.js 製ECサイトです。SEO構造化データとリアルタイムチャットを標準搭載しています。
        </p>
      </section>

      <section className="grid" aria-label="デジタル商品一覧">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ChatWidget />
    </main>
  );
}
