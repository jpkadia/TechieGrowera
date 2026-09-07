import { socialImage } from '@/lib/social-image';
import { posts } from '@/content/editorial';
import { notFound } from 'next/navigation';
export const alt = 'Techie Growera blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = posts.find((s) => s.slug === slug);
  if (!s) notFound();
  return socialImage(s.title);
}
