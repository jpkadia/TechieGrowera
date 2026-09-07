import { socialImage } from '@/lib/social-image';
export const alt = 'Good things start with a conversation.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return socialImage('Good things start with a conversation.');
}
