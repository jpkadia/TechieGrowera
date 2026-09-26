import type { Metadata } from 'next';
import { business, type Founder } from '@/content/business';
export type { Founder };
const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  (process.env.NODE_ENV === 'production' ? 'https://techiegrowera.vercel.app' : 'http://localhost:3000');
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
  tagline: business.tagline,
  url: parsedUrl.origin,
  indexable:
    process.env.NEXT_PUBLIC_SITE_INDEXABLE !== 'false' &&
    parsedUrl.protocol === 'https:' &&
    !['localhost', '127.0.0.1'].includes(parsedUrl.hostname),
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || business.email,
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || business.phones[0],
  phones: [
    process.env.NEXT_PUBLIC_BUSINESS_PHONE || business.phones[0],
    process.env.NEXT_PUBLIC_BUSINESS_PHONE_SECONDARY || business.phones[1],
  ],
  founders: business.founders,
  serviceArea: process.env.NEXT_PUBLIC_SERVICE_AREA || 'Ahmedabad, Gujarat, India',
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || 'Ahmedabad, Gujarat, India',
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || business.linkedin,
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || business.instagram,
  youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || business.youtube,
  twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || business.twitter,
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || business.facebook,
  socials: [
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || business.linkedin,
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || business.instagram,
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || business.facebook,
    process.env.NEXT_PUBLIC_SOCIAL_TWITTER || business.twitter,
    process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || business.youtube,
  ].filter(Boolean) as string[],
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
    title: path === '/' ? { absolute: `${site.name} — ${title}` } : title,
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
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absolute(image)],
      site: '@techiegrowera',
      creator: '@techiegrowera',
    },
    robots: { index: site.indexable && !noindex, follow: true },
  };
}
