import type { Metadata } from 'next';
import { getCategoryLabel, type Product } from '@/data/products';

const siteName = 'Digital Creator Market';

export function buildProductMetadata(product: Product): Metadata {
  const title = `${product.name} | ${siteName}`;
  const description = `${product.description}（カテゴリ: ${getCategoryLabel(product.category)} / 形式: ${product.fileFormat} / ライセンス: ${product.license}）`;
  const productUrl = `/products/${product.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: productUrl
    },
    openGraph: {
      type: 'website',
      url: productUrl,
      title,
      description
    },
    twitter: {
      card: 'summary',
      title,
      description
    }
  };
}
