import type { Metadata } from 'next';
import type { Product } from '@/data/products';

export function buildProductMetadata(product: Product): Metadata {
  const title = product.name;

  return {
    title,
    description: `${product.description}（形式: ${product.fileFormat} / ライセンス: ${product.license}）`,
    openGraph: {
      title,
      description: product.description,
      type: 'website',
      url: `/products/${product.id}`
    },
    twitter: {
      title,
      description: product.description,
      card: 'summary_large_image'
    },
    alternates: {
      canonical: `/products/${product.id}`
    }
  };
}
