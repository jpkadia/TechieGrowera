import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { JsonLd } from '@/components/ui';
import { Analytics } from '@/components/analytics';
import { absolute, site } from '@/lib/site';
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {' '}
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
    </>
  );
}
