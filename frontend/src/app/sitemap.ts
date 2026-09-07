import type { MetadataRoute } from 'next';
import { services } from '@/content/services';
import { posts, caseStudies } from '@/content/editorial';
import { absolute, site } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.indexable) return [];
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
