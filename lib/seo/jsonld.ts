import { getCategoryLabel, type Product } from '@/data/products';

export function buildProductJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    category: getCategoryLabel(product.category),
    keywords: product.tags.join(', '),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'JPY',
      price: product.priceJpy,
      availability: 'https://schema.org/InStock',
      url: `/products/${product.slug}`
    }
  };
}
