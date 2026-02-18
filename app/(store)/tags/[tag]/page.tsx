import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { getProductsByTag } from '@/data/products';
import { buildTagMetadata } from '@/lib/seo/metadata';

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return buildTagMetadata(tag);
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const items = getProductsByTag(tag);
  const canonical = `/tags/${encodeURIComponent(tag)}`;

  return (
    <main>
      <Breadcrumbs
        items={[
          { name: 'ホーム', path: '/' },
          { name: '商品一覧', path: '/products' },
          { name: tag, path: canonical }
        ]}
      />
      <h1>タグ: {tag}</h1>
      <p>ニーズ軸で商品を比較できます。</p>
      <section className="grid" aria-label="タグ商品一覧">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}
