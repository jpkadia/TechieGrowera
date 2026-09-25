import { socialImage } from '@/lib/social-image';
import { getPosts } from '@/lib/published-content';
import { notFound } from 'next/navigation';
export const alt = 'Techie Growera blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
const slugAliases: Record<string, string> = {
  'meta-ads-campaign': 'before-your-first-meta-ads-campaign',
  'before-your-first-meta-ads-campaign': 'meta-ads-campaign',
  'social-content-plan': 'building-a-useful-social-content-plan',
  'building-a-useful-social-content-plan': 'social-content-plan',
  'website-redesign-seo': 'website-redesign-seo-checklist',
  'website-redesign-seo-checklist': 'website-redesign-seo',
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const s = posts.find((s) => s.slug === slug || s.slug === slugAliases[slug]);
  if (!s) notFound();
  return socialImage(s.title);
}
