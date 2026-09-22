import React from 'react';
import { Linkedin, Instagram, Facebook, Youtube } from 'lucide-react';
import { site } from '@/lib/site';

export function XIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export type SocialProfile = {
  name: string;
  label: string;
  handle: string;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
};

/**
 * Strict Brand Social Profiles in exact requested order:
 * 1. LinkedIn
 * 2. Instagram
 * 3. Facebook
 * 4. X (Twitter)
 * 5. YouTube
 */
export const socialProfiles: SocialProfile[] = [
  {
    name: 'LinkedIn',
    label: 'LinkedIn · Techie Growera',
    handle: '@techiegrowera',
    url: site.linkedin,
    icon: Linkedin,
  },
  {
    name: 'Instagram',
    label: 'Instagram · @techiegrowera',
    handle: '@techiegrowera',
    url: site.instagram,
    icon: Instagram,
  },
  {
    name: 'Facebook',
    label: 'Facebook · Techie Growera',
    handle: 'Techie Growera',
    url: site.facebook,
    icon: Facebook,
  },
  {
    name: 'X',
    label: 'X (Twitter) · @techiegrowera',
    handle: '@techiegrowera',
    url: site.twitter,
    icon: XIcon,
  },
  {
    name: 'YouTube',
    label: 'YouTube · @techiegrowera',
    handle: '@techiegrowera',
    url: site.youtube,
    icon: Youtube,
  },
].filter((item) => Boolean(item.url));
