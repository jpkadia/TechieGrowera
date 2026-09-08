import type { MetadataRoute } from 'next';
import { services } from '@/content/services';
import { getPosts, getCaseStudies } from '@/lib/published-content';
import { absolute, site } from '@/lib/site';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.indexable) return [];
  // Preserve the independently available pages even during a CMS outage.
  // Never substitute seed records: they may have been archived by the editor.
  const [postResult, caseResult] = await Promise.allSettled([getPosts(), getCaseStudies()]);
  const posts = postResult.status === 'fulfilled' ? postResult.value : [];
  const caseStudies = caseResult.status === 'fulfilled' ? caseResult.value : [];
  if (postResult.status === 'rejected' || caseResult.status === 'rejected')
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
    ...(caseStudies.some((s) => !s.demo) ? [{ url: absolute('/case-studies') }] : []),
    ...caseStudies
      .filter((s) => !s.demo)
      .map((s) => ({ url: absolute(`/case-studies/${s.slug}`), lastModified: s.updatedAt })),
  ];
}
