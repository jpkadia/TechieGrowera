import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { site } from '@/lib/site';
import './globals.css';
const manrope = localFont({
  src: '../../public/fonts/manrope-latin.woff2',
  variable: '--font-manrope',
  display: 'swap',
  weight: '200 800',
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Techie Growera | Web, Creative & Digital Growth Agency',
    template: '%s | Techie Growera',
  },
  description:
    'Build and grow your digital presence with website development, SEO, creative and digital marketing.',
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined },
  icons: { icon: '/brand/mark.svg', apple: '/brand/logo.png' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className={manrope.variable}>{children}</body>
    </html>
  );
}
