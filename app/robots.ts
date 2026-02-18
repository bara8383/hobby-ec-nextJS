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
      allow: '/',
      disallow: ['/api/', '/admin/', '/checkout/', '/cart/', '/mypage/']
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`
  };
}
