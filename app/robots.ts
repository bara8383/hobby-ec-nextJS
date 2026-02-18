import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/seo/metadata';

const isProduction = process.env.NODE_ENV === 'production';

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
    rules: {
      userAgent: '*',
      allow: ['/', '/products', '/categories', '/tags', '/help', '/faq', '/contact', '/chat', '/legal'],
      disallow: ['/api/', '/admin/', '/checkout/', '/cart/', '/mypage/', '/search']
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`
  };
}
