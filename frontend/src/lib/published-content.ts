import 'server-only';
import { cache } from 'react';
import { posts, caseStudies, type BlogPost, type CaseStudy } from '@/content/editorial';
async function readPublished<T>(kind: string, fallback: T[]): Promise<T[]> {
  if (process.env.CMS_ENABLED !== 'true') return fallback;
  const base = process.env.API_BASE_URL;
  const secret = process.env.API_PROXY_SECRET;
  if (!base || !secret) return fallback;

  try {
    const response = await fetch(new URL(`/api/published/${kind}`, base), {
      headers: { 'x-api-proxy-secret': secret },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      console.warn(`[CMS] Upstream returned status ${response.status} for ${kind}, using fallback.`);
      return fallback;
    }
    const data = await response.json();
    if (!data.ok || !Array.isArray(data.items)) {
      console.warn(`[CMS] Invalid response structure for ${kind}, using fallback.`);
      return fallback;
    }
    return data.items;
  } catch (err) {
    // If backend is sleeping / timing out on Render free tier, seamlessly serve the fallback
    console.warn(`[CMS] Backend unavailable for ${kind} (${(err as Error).message}), serving editorial fallback.`);
    return fallback;
  }
}
// Request-scoped deduplication only. No stale cross-request content or draft fallback.
export const getPosts = cache(() => readPublished<BlogPost>('blog', posts));
export const getCaseStudies = cache(() => readPublished<CaseStudy>('case-studies', caseStudies));
