import type { MetadataRoute } from 'next';
import { absolute, site } from '@/lib/site';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
    ...(site.indexable && { sitemap: absolute('/sitemap.xml') }),
  };
}
