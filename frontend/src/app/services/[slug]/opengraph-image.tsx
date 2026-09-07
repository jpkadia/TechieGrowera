import { socialImage } from '@/lib/social-image';
import { services } from '@/content/services';
import { notFound } from 'next/navigation';
export const alt = 'Techie Growera services';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  if (!s) notFound();
  return socialImage(s.name);
}
