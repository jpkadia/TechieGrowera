import { socialImage } from '@/lib/social-image';
import { caseStudies } from '@/content/editorial';
import { notFound } from 'next/navigation';
export const alt = 'Techie Growera case-studies';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = caseStudies.find((s) => s.slug === slug);
  if (!s) notFound();
  return socialImage(s.title);
}
