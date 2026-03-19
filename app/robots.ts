import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/seo/metadata';

const isProduction = process.env.NODE_ENV === 'production';
const PUBLIC_ALLOW_PATHS = ['/', '/products', '/categories', '/tags', '/faq', '/help', '/legal'];
const PRIVATE_DISALLOW_PATHS = ['/api/', '/admin/', '/cart/', '/checkout/', '/mypage/', '/search'];
const FUTURE_CRAWLER_RULES: Array<{
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
}> = [];

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/'
      }
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: PUBLIC_ALLOW_PATHS,
        disallow: PRIVATE_DISALLOW_PATHS
      },
      ...FUTURE_CRAWLER_RULES
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`
  };
}
