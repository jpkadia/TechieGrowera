import { socialImage } from '@/lib/social-image';
import { getPortfolio } from '@/lib/published-content';
import { notFound } from 'next/navigation';

export const alt = 'Techie Growera portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const portfolio = await getPortfolio();
  const project = portfolio.find((item) => item.slug === slug);
  if (!project) notFound();
  return socialImage(project.title);
}
