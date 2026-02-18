import { getCategoryLabel, type Product } from '@/data/products';

const SITE_URL = 'https://example.com';
const BRAND_NAME = 'Digital Creator Market';

function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function buildProductJsonLd(product: Product) {
  const productUrl = toAbsoluteUrl(`/products/${product.slug}`);
  const imageUrls = product.media
    .filter((media) => media.type === 'image' && media.url)
    .map((media) => toAbsoluteUrl(media.url));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: imageUrls.length > 0 ? imageUrls : undefined,
    sku: product.sku || product.slug,
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME
    },
    category: getCategoryLabel(product.category),
    keywords: product.tags.join(', '),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'JPY',
      price: product.priceJpy,
      availability: 'https://schema.org/InStock',
      url: productUrl
    }
  };
}
