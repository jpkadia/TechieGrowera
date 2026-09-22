import { socialImage } from '@/lib/social-image';
import { site } from '@/lib/site';
export const alt = `Techie Growera — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return socialImage(site.tagline);
}
