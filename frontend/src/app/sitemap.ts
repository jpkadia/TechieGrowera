import type { MetadataRoute } from 'next';
import { services } from '@/content/services';
import { getPosts, getPortfolio } from '@/lib/published-content';
import { absolute, site } from '@/lib/site';

export const revalidate = 3600; // Cache sitemap for 1 hour; instant response for search crawlers

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.indexable) return [];
  // Preserve the independently available pages even during a CMS outage.
  // Never substitute seed records: they may have been archived by the editor.
  const [postResult, portfolioResult] = await Promise.allSettled([getPosts(), getPortfolio()]);
  const posts = postResult.status === 'fulfilled' ? postResult.value : [];
  const portfolio = portfolioResult.status === 'fulfilled' ? portfolioResult.value : [];
  if (postResult.status === 'rejected' || portfolioResult.status === 'rejected')
    console.warn('Sitemap: published content temporarily unavailable; returning available URLs.');
  return [
    ...[
      '/',
      '/about',
      '/services',
      '/portfolio',
      '/blog',
      '/contact',
      '/privacy-policy',
      '/terms',
    ].map((path) => ({ url: absolute(path) })),
    ...services.map((s) => ({ url: absolute(`/services/${s.slug}`) })),
    ...posts.map((p) => ({ url: absolute(p.canonicalPath), lastModified: p.updatedAt })),
    ...portfolio
      .filter((p) => !p.demo)
      .map((p) => ({ url: absolute(`/portfolio/${p.slug}`), lastModified: p.updatedAt })),
  ];
}
