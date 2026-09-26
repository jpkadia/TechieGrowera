import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ChatWidget } from '@/components/chatbot/chat-widget';
import { Warmup } from '@/components/warmup';
import { RouteScrollReset } from '@/components/route-scroll-reset';
import { JsonLd } from '@/components/ui';
import { Analytics } from '@/components/analytics';
import { VisitorTracker } from '@/components/visitor-tracker';
import { absolute, site } from '@/lib/site';
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RouteScrollReset />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Warmup />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <ChatWidget />
      <Analytics />
      <VisitorTracker />
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': absolute('/#organization'),
            name: site.name,
            alternateName: ['TechieGrowera', 'Techie Grow Era', 'TechieGrowera Agency'],
            slogan: site.tagline,
            url: site.url,
            logo: absolute('/brand/logo.png'),
            image: absolute('/brand/logo.png'),
            ...(site.email && { email: site.email }),
            ...(site.phone && { telephone: site.phone }),
            founder: site.founders.map((f) => ({
              '@type': 'Person',
              '@id': absolute(`/about#${f.name.toLowerCase().replace(/\s+/g, '-')}`),
              name: f.name,
              givenName: f.name.split(' ')[0],
              familyName: f.name.split(' ')[1] || '',
              alternateName:
                f.name === 'Parth Kadiya' ? ['Parth Kadia', 'Parth'] : ['Kush Kadiya', 'Kush'],
              jobTitle: `Co-Founder & ${f.role}`,
              worksFor: { '@id': absolute('/#organization') },
              ...(f.image
                ? {
                    image: {
                      '@type': 'ImageObject',
                      '@id': absolute(`${f.image}#photo`),
                      url: absolute(f.image),
                      contentUrl: absolute(f.image),
                      name: `${f.name} — Co-Founder & ${f.role} at Techie Growera`,
                      caption: `${f.name}, Co-Founder and ${f.role} at Techie Growera`,
                      width: 1254,
                      height: 1254,
                      encodingFormat: 'image/webp',
                    },
                  }
                : {}),
              ...(f.portfolio ? { url: f.portfolio } : {}),
              ...(f.linkedin ? { sameAs: [f.linkedin] } : {}),
            })),
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
            alternateName: [
              'TechieGrowera',
              'Techie Grow Era',
              'TechieGrowera Agency',
              new URL(site.url).hostname,
            ],
            url: site.url,
            dateModified: '2026-09-26',
            publisher: { '@id': absolute('/#organization') },
          },
          ...(site.address && site.phone && site.serviceArea
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'ProfessionalService',
                  '@id': absolute('/#localbusiness'),
                  name: site.name,
                  alternateName: ['TechieGrowera', 'Techie Grow Era'],
                  url: site.url,
                  logo: absolute('/brand/logo.png'),
                  image: absolute('/brand/logo.png'),
                  telephone: site.phone,
                  email: site.email,
                  priceRange: '₹₹',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Ahmedabad',
                    addressRegion: 'Gujarat',
                    addressCountry: 'IN',
                  },
                  areaServed: [
                    { '@type': 'AdministrativeArea', name: 'Ahmedabad' },
                    { '@type': 'AdministrativeArea', name: 'Gujarat' },
                    { '@type': 'Country', name: 'India' },
                    { '@type': 'Place', name: 'Worldwide' },
                  ],
                  sameAs: site.socials,
                },
              ]
            : []),
        ]}
      />
    </>
  );
}
