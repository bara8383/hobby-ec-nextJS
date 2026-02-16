import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import {
  getCategoryLabel,
  getProductsByCategory,
  isDigitalCategory,
  PRODUCT_CATEGORIES
} from '@/data/products';

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

  const label = getCategoryLabel(category);

  return {
    title: `${label}カテゴリ`,
    description: `${label}カテゴリのデジタル商品一覧ページです。`,
    alternates: {
      canonical: `/categories/${category}`
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!isDigitalCategory(category)) {
    notFound();
  }

  const items = getProductsByCategory(category);

  return (
    <main>
      <h1>{getCategoryLabel(category)}</h1>
      <p>カテゴリ特化ページとして、検索意図に合う商品をまとめています。</p>
      <section className="grid" aria-label="カテゴリ商品一覧">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}
