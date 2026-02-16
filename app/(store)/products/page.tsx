import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';

export const metadata: Metadata = {
  title: '商品一覧',
  description: '壁紙・イラスト・写真・デジタル音源のダウンロード商品一覧です。',
  alternates: {
    canonical: '/products'
  }
};

export default function ProductsPage() {
  return (
    <main>
      <h1>商品一覧</h1>
      <p>カテゴリ・タグ・価格帯で絞り込みながら、用途に合うデジタル商品を探せます。</p>
      <section className="grid" aria-label="商品一覧">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}
