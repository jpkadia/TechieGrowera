import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { JsonLd } from '@/components/ui';
import { Analytics } from '@/components/analytics';
import { absolute, site } from '@/lib/site';
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
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className={manrope.variable}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': absolute('/#organization'),
              name: site.name,
              url: site.url,
              logo: absolute('/brand/logo.png'),
              ...(site.email && { email: site.email }),
              ...(site.phone && { telephone: site.phone }),
              founder: site.founders.map((name) => ({ '@type': 'Person', name })),
              contactPoint: site.phones.map((telephone) => ({
                '@type': 'ContactPoint',
                telephone,
                contactType: 'customer enquiries',
                email: site.email,
              })),
              ...(site.socials.length && { sameAs: site.socials }),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': absolute('/#website'),
              name: site.name,
              url: site.url,
              publisher: { '@id': absolute('/#organization') },
            },
            ...(site.address && site.phone && site.serviceArea
              ? [
                  {
                    '@context': 'https://schema.org',
                    '@type': 'ProfessionalService',
                    name: site.name,
                    url: site.url,
                    image: absolute('/brand/logo.png'),
                    address: site.address,
                    telephone: site.phone,
                    areaServed: site.serviceArea,
                  },
                ]
              : []),
          ]}
        />
      </body>
    </html>
  );
}
