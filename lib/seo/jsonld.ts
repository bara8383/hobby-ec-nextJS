import { getCategoryLabel, type Product } from '@/data/products';

export function buildProductJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
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
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'ホーム',
            item: '/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '商品一覧',
            item: '/products'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.name,
            item: `/products/${product.slug}`
          }
        ]
      }
    ]
  };
}
