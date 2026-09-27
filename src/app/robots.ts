import type { MetadataRoute } from 'next';
import { siteUrl, isProduction } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProduction
      ? { userAgent: '*', allow: '/', disallow: ['/api/', '/*/design-system'] }
      : { userAgent: '*', disallow: '/' },
    ...(isProduction ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
