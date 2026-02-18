import type { Metadata } from 'next';
import { getCategoryLabel, type Product } from '@/data/products';

const siteName = 'Digital Creator Market';

export function buildProductMetadata(product: Product, ogImageUrl?: string): Metadata {
  const title = `${product.name} | ${siteName}`;
  const description = `${product.description}（カテゴリ: ${getCategoryLabel(product.category)} / 形式: ${product.fileFormat} / ライセンス: ${product.license}）`;
  const productUrl = `/products/${product.slug}`;
  const images = ogImageUrl ? [{ url: ogImageUrl, alt: `${product.name} のOG画像` }] : undefined;

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
      description,
      images
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images
    }
  };
}
