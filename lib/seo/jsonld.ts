import { getCategoryLabel, type Product } from '@/data/products';
import { SITE_NAME, SITE_ORIGIN, toAbsoluteUrl } from '@/lib/seo/metadata';

const SUPPORT_EMAIL = 'support@example.com';

type FaqItem = {
  question: string;
  answer: string;
};

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_ORIGIN,
    email: SUPPORT_EMAIL
  };
}

export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
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
      name: SITE_NAME
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
