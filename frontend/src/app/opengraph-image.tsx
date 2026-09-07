import { socialImage } from '@/lib/social-image';
export const alt = 'Your brand. Engineered to grow.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return socialImage('Your brand. Engineered to grow.');
}
