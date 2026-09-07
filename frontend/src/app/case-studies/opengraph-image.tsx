import { socialImage } from '@/lib/social-image';
export const alt = 'The thinking behind the work.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return socialImage('The thinking behind the work.');
}
