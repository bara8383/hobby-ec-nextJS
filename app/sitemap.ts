import type { MetadataRoute } from 'next';
import { PRODUCT_CATEGORIES, allTags, products } from '@/data/products';
import { toAbsoluteUrl } from '@/lib/seo/metadata';

const STATIC_ROUTES: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }> = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/products', changeFrequency: 'daily', priority: 0.9 },
  { path: '/categories', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/tags', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/faq', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/help', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/deals', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/ranking', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/legal/tokushoho', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/legal/terms', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/legal/privacy', changeFrequency: 'yearly', priority: 0.4 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: toAbsoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));

  const categoryRoutes: MetadataRoute.Sitemap = PRODUCT_CATEGORIES.map((category) => ({
    url: toAbsoluteUrl(`/categories/${category}`),
    changeFrequency: 'weekly',
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
    priority: 0.8
  }));

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...productRoutes];
}
