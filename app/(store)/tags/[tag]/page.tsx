import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { getProductsByTag } from '@/data/products';

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;

  return {
    title: `タグ: ${tag}`,
    description: `${tag}に関連するデジタル商品一覧です。`,
    robots: {
      index: false,
      follow: true
    }
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const items = getProductsByTag(tag);

  return (
    <main>
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
