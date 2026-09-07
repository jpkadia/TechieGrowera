import 'server-only';
import { cache } from 'react';
import { posts, caseStudies, type BlogPost, type CaseStudy } from '@/content/editorial';
async function readPublished<T>(kind: string, fallback: T[]): Promise<T[]> {
  if (process.env.CMS_ENABLED !== 'true') return fallback;
  const base = process.env.API_BASE_URL;
  const secret = process.env.API_PROXY_SECRET;
  if (!base || !secret) throw new Error('Published content service is not configured.');
  const response = await fetch(new URL(`/api/published/${kind}`, base), {
    headers: { 'x-api-proxy-secret': secret },
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('Published content is temporarily unavailable.');
  const data = await response.json();
  if (!data.ok || !Array.isArray(data.items)) throw new Error('Invalid content response.');
  return data.items;
}
// Request-scoped deduplication only. No stale cross-request content or draft fallback.
export const getPosts = cache(() => readPublished<BlogPost>('blog', posts));
export const getCaseStudies = cache(() => readPublished<CaseStudy>('case-studies', caseStudies));
