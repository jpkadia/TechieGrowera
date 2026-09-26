import type { MetadataRoute } from 'next';
import { services } from '@/content/services';
import { getPosts, getPortfolio } from '@/lib/published-content';
import { absolute, site } from '@/lib/site';

// Cache sitemap for 1 hour; instant response for search crawlers
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.indexable) return [];

  // Current update timestamp (2026-09-26) to signal search engine crawlers for fast re-indexing
  const today = new Date('2026-09-26T16:00:00+05:30');

  // Preserve the independently available pages even during a CMS outage.
  // Never substitute seed records: they may have been archived by the editor.
  const [postResult, portfolioResult] = await Promise.allSettled([getPosts(), getPortfolio()]);
  const posts = postResult.status === 'fulfilled' ? postResult.value : [];
  const portfolio = portfolioResult.status === 'fulfilled' ? portfolioResult.value : [];
  if (postResult.status === 'rejected' || portfolioResult.status === 'rejected')
    console.warn('Sitemap: published content temporarily unavailable; returning available URLs.');

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: absolute('/'),
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
      images: [
        absolute('/brand/logo.png'),
        absolute('/team/parth.webp'),
        absolute('/team/kush.webp'),
      ],
    },
    {
      url: absolute('/about'),
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [
        absolute('/team/parth.webp'),
        absolute('/team/kush.webp'),
        absolute('/images/transparent-agency-studio.webp'),
      ],
    },
    {
      url: absolute('/services'),
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absolute('/portfolio'),
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: absolute('/blog'),
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: absolute('/contact'),
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absolute('/privacy-policy'),
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: absolute('/terms'),
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: absolute(`/services/${s.slug}`),
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absolute(p.canonicalPath),
    lastModified: p.updatedAt ? new Date(p.updatedAt) : today,
    changeFrequency: 'weekly',
    priority: 0.75,
    ...(p.featuredImage ? { images: [absolute(p.featuredImage)] } : {}),
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolio
    .filter((p) => !p.demo)
    .map((p) => ({
      url: absolute(`/portfolio/${p.slug}`),
      lastModified: p.updatedAt ? new Date(p.updatedAt) : today,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [...coreRoutes, ...serviceRoutes, ...postRoutes, ...portfolioRoutes];
}

