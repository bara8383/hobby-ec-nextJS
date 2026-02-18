import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import {
  getCategoryLabel,
  getProductsByCategory,
  isDigitalCategory,
  PRODUCT_CATEGORIES
} from '@/data/products';
import { buildCategoryMetadata } from '@/lib/seo/metadata';

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return PRODUCT_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isDigitalCategory(category)) {
    return { title: 'カテゴリが見つかりません' };
  }

  return buildCategoryMetadata(category);
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!isDigitalCategory(category)) {
    notFound();
  }

  const items = getProductsByCategory(category);
  const categoryLabel = getCategoryLabel(category);

  return (
    <main>
      <Breadcrumbs
        items={[
          { name: 'ホーム', path: '/' },
          { name: '商品一覧', path: '/products' },
          { name: categoryLabel, path: `/categories/${category}` }
        ]}
      />
      <h1>{categoryLabel}</h1>
      <p>カテゴリ特化ページとして、検索意図に合う商品をまとめています。</p>
      <section className="grid" aria-label="カテゴリ商品一覧">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}
