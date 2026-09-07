import type { Metadata } from 'next';
import { business } from '@/content/business';
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const parsedUrl = new URL(configuredUrl);
if (
  !['http:', 'https:'].includes(parsedUrl.protocol) ||
  parsedUrl.pathname !== '/' ||
  parsedUrl.search ||
  parsedUrl.hash
)
  throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without a path.');
export const site = {
  name: 'Techie Growera',
  url: parsedUrl.origin,
  indexable:
    process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true' &&
    parsedUrl.protocol === 'https:' &&
    !['localhost', '127.0.0.1'].includes(parsedUrl.hostname),
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || business.email,
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || business.phones[0],
  phones: [
    process.env.NEXT_PUBLIC_BUSINESS_PHONE || business.phones[0],
    process.env.NEXT_PUBLIC_BUSINESS_PHONE_SECONDARY || business.phones[1],
  ],
  founders: business.founders,
  serviceArea: process.env.NEXT_PUBLIC_SERVICE_AREA || '',
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || '',
  socials: [
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || business.instagram,
  ].filter((value): value is string => !!value && /^https:\/\//.test(value)),
};
export const absolute = (path: string) => new URL(path, site.url).toString();
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  noindex = false,
): Metadata {
  const image = path === '/' ? '/opengraph-image' : `${path}/opengraph-image`;
  return {
    title: path === '/' ? `${site.name} | ${title}` : title,
    description,
    alternates: { canonical: absolute(path) },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: absolute(path),
      siteName: site.name,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: absolute(image), width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [absolute(image)] },
    robots: { index: site.indexable && !noindex, follow: true },
  };
}
