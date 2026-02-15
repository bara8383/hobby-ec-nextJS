import { ChatWidget } from '@/components/ChatWidget';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';

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
        <h1>Hobby EC Store</h1>
        <p>
          Next.js App Router + Metadata API + JSON-LD による SEO 最適化と、
          リアルタイムチャットを実装したサンプルECサイトです。
        </p>
      </section>

      <section className="grid" aria-label="商品一覧">
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
