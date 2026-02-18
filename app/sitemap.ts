import type { MetadataRoute } from 'next';
import { PRODUCT_CATEGORIES, allTags, products } from '@/data/products';
import { SITE_ORIGIN } from '@/lib/seo/metadata';

function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: toAbsoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: toAbsoluteUrl('/products'), changeFrequency: 'daily', priority: 0.9 },
    { url: toAbsoluteUrl('/categories'), changeFrequency: 'weekly', priority: 0.8 },
    { url: toAbsoluteUrl('/tags'), changeFrequency: 'weekly', priority: 0.7 },
    { url: toAbsoluteUrl('/faq'), changeFrequency: 'weekly', priority: 0.6 },
    { url: toAbsoluteUrl('/help'), changeFrequency: 'weekly', priority: 0.6 },
    { url: toAbsoluteUrl('/contact'), changeFrequency: 'monthly', priority: 0.5 },
    { url: toAbsoluteUrl('/chat'), changeFrequency: 'weekly', priority: 0.5 },
    { url: toAbsoluteUrl('/legal/tokushoho'), changeFrequency: 'yearly', priority: 0.4 },
    { url: toAbsoluteUrl('/legal/terms'), changeFrequency: 'yearly', priority: 0.4 },
    { url: toAbsoluteUrl('/legal/privacy'), changeFrequency: 'yearly', priority: 0.4 }
  ];

  const categoryRoutes: MetadataRoute.Sitemap = PRODUCT_CATEGORIES.map((category) => ({
    url: toAbsoluteUrl(`/categories/${category}`),
    changeFrequency: 'daily',
    priority: 0.8
  }));

  const tagRoutes: MetadataRoute.Sitemap = allTags.map((tag) => ({
    url: toAbsoluteUrl(`/tags/${encodeURIComponent(tag)}`),
    changeFrequency: 'weekly',
    priority: 0.7
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: toAbsoluteUrl(`/products/${product.slug}`),
    lastModified: new Date(product.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.6
  }));

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...productRoutes];
}
