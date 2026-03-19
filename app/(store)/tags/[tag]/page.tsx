import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { getProductsByTag } from '@/data/products';
import { buildTagMetadata, buildNoIndexRobots } from '@/lib/seo/metadata';

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const items = getProductsByTag(tag);

  if (items.length === 0) {
    return {
      title: 'タグが見つかりません',
      robots: buildNoIndexRobots(false)
    };
  }

  return buildTagMetadata(tag);
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const items = getProductsByTag(tag);

  if (items.length === 0) {
    notFound();
  }

  const canonical = `/tags/${encodeURIComponent(tag)}`;

  return (
    <main>
      <Breadcrumbs
        items={[
          { name: 'ホーム', path: '/' },
          { name: 'タグ一覧', path: '/tags' },
          { name: tag, path: canonical }
        ]}
      />
      <h1>{tag}タグの商品一覧</h1>
      <p className="section-description">
        {tag}に関連する商品を、用途と形式が分かる状態でまとめています。
      </p>
      <section className="grid" aria-label="タグ商品一覧">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}
