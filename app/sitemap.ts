import type { MetadataRoute } from 'next';
import { PRODUCT_CATEGORIES, allTags, products } from '@/data/products';
import { SITE_ORIGIN } from '@/lib/seo/metadata';

function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl('/'),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: toAbsoluteUrl('/products'),
      changeFrequency: 'daily',
      priority: 0.9
    }
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
