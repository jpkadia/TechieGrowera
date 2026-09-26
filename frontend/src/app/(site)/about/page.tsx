import Image from 'next/image';
import { Breadcrumbs, ButtonLink, CTA, SectionHeading, CheckList, JsonLd } from '@/components/ui';
import { absolute, pageMetadata, site } from '@/lib/site';
export const metadata = pageMetadata(
  'About Our Digital Agency',
  'Meet the thinking behind Techie Growera: scaling digital presence with intent through web development, creative services and sustainable digital growth.',
  '/about',
);
export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'About', href: '/about' }]} />
          <span className="eyebrow">SCALING DIGITAL PRESENCE WITH INTENT</span>
          <h1>
            About
            <br />Techie Growera.
          </h1>
          <p className="intro">
            Techie Growera helps businesses scale their digital presence with intent. We connect the
            craft of making things with the clarity of knowing why they matter.
          </p>
        </div>
      </section>
      <section className="section container split">
        <div>
          <SectionHeading label="OUR PERSPECTIVE" title="Your business is the starting point." />
          <p className="lead">
            A website, a brand identity and a campaign should tell the same story. Our approach
            brings web, creative and growth work together so each part supports the next.
          </p>
          <ButtonLink href="/services">Explore what we do</ButtonLink>
        </div>
        <div className="content-panel">
          <h2>What you can expect</h2>
          <CheckList
            items={[
              'A conversation about your audience and goals',
              'A clearly defined scope before work starts',
              'Purposeful design and practical technology choices',
              'Transparent feedback and review milestones',
              'Honest reporting without inflated claims',
            ]}
          />
        </div>
      </section>
      <section className="why-section section about-principles">
        <div className="container">
          <SectionHeading label="HOW WE THINK" title="Principles we bring to every project." />
          <div className="about-values">
            {[
              [
                'Clarity before complexity',
                'We make the important things easy to understand, for your customers and for your team.',
              ],
              [
                'Craft with a purpose',
                'Design and technology should solve a real problem, not add friction or unnecessary decoration.',
              ],
              [
                'Growth through learning',
                'We build a foundation, review what happens and make thoughtful improvements over time.',
              ],
            ].map(([h, p]) => (
              <article key={h}>
                <h3>{h}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="about-studio-fullwidth">
        <div className="about-studio-fullwidth-media">
          <Image
            src="/images/transparent-agency-studio.webp"
            alt="Techie Growera founders collaborating in modern tech studio"
            width={1672}
            height={941}
            sizes="100vw"
            className="about-studio-fullwidth-img"
          />
        </div>
        <div className="about-studio-fullwidth-bar">
          <div className="container about-studio-caption-content">
            <span className="about-studio-tag">STUDIO &amp; COLLABORATION</span>
            <p>Where intentional strategy, modern engineering, and purposeful design intersect.</p>
          </div>
        </div>
      </section>
      <section className="section container split">
        <SectionHeading label="MEET THE FOUNDERS" title="The people behind\nTechie Growera." />
        <div>
          <p className="lead" style={{ marginTop: 0 }}>
            The best starting point is an honest conversation about what you want to improve, what
            you have already tried and what a useful outcome would look like.
          </p>
          <p>
            Techie Growera was founded by Parth Kadiya and Kush Kadia. Start a conversation with us
            about your business, your ideas and the digital presence you want to build.
          </p>
          <div className="founder-grid">
            {site.founders.map((founder) => (
              <article
                key={founder.name}
                className="founder-card"
                itemScope
                itemType="https://schema.org/Person"
              >
                <meta itemProp="name" content={founder.name} />
                <meta itemProp="jobTitle" content={`Co-Founder & ${founder.role}`} />
                <meta itemProp="worksFor" content="Techie Growera" />
                {founder.image ? (
                  <Image
                    src={founder.image}
                    alt={`${founder.name} — Co-Founder & ${founder.role} at Techie Growera`}
                    title={`${founder.name} — Co-Founder & ${founder.role} at Techie Growera`}
                    width={224}
                    height={224}
                    sizes="112px"
                    priority
                    itemProp="image"
                    className="founder-avatar"
                  />
                ) : (
                  <span aria-hidden="true" className="founder-initials">
                    {founder.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </span>
                )}
                <h3 itemProp="name">{founder.name}</h3>
                <p>{founder.role}</p>
                {(founder.portfolio || founder.linkedin) && (
                  <div className="founder-links">
                    {founder.portfolio && (
                      <a
                        href={founder.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="founder-link"
                        itemProp="url"
                      >
                        Portfolio ↗
                        <span className="sr-only"> for {founder.name} (opens in new tab)</span>
                      </a>
                    )}
                    {founder.linkedin && (
                      <a
                        href={founder.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="founder-link"
                        itemProp="sameAs"
                      >
                        LinkedIn ↗
                        <span className="sr-only"> for {founder.name} (opens in new tab)</span>
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA />
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            '@id': absolute('/about#webpage'),
            url: absolute('/about'),
            name: 'About Techie Growera | Digital Agency Founders & Vision',
            description:
              'Meet Parth Kadiya and Kush Kadia, co-founders of Techie Growera — scaling digital presence with intent through web engineering, creative design, and digital marketing.',
            datePublished: '2026-01-01',
            dateModified: '2026-09-26',
            inLanguage: 'en-IN',
            isPartOf: { '@id': absolute('/#website') },
            mainEntity: site.founders.map((f) => ({
              '@type': 'Person',
              '@id': absolute(`/about#${f.name.toLowerCase().replace(/\s+/g, '-')}`),
              name: f.name,
              givenName: f.name.split(' ')[0],
              familyName: f.name.split(' ')[1] || '',
              alternateName:
                f.name === 'Parth Kadiya' ? ['Parth Kadia', 'Parth'] : ['Kush Kadiya', 'Kush'],
              jobTitle: `Co-Founder & ${f.role}`,
              description:
                f.name === 'Parth Kadiya'
                  ? 'Co-Founder and Web Developer at Techie Growera, leading web application development, Next.js architecture, and technical SEO.'
                  : 'Co-Founder and Digital Marketing Executive at Techie Growera, leading performance marketing, Meta Ads, and brand growth.',
              worksFor: {
                '@type': 'Organization',
                '@id': absolute('/#organization'),
                name: site.name,
                url: site.url,
              },
              ...(f.image
                ? {
                    image: {
                      '@type': 'ImageObject',
                      '@id': absolute(`${f.image}#photo`),
                      url: absolute(f.image),
                      contentUrl: absolute(f.image),
                      name: `${f.name} — Co-Founder & ${f.role} at Techie Growera`,
                      caption: `${f.name}, Co-Founder and ${f.role} at Techie Growera`,
                      description: `Official portrait of ${f.name}, Co-Founder and ${f.role} at Techie Growera digital agency in Ahmedabad, Gujarat, India.`,
                      width: 1254,
                      height: 1254,
                      encodingFormat: 'image/webp',
                      creator: {
                        '@type': 'Organization',
                        name: site.name,
                      },
                      creditText: site.name,
                      copyrightNotice: `© ${new Date().getFullYear()} ${site.name}`,
                    },
                  }
                : {}),
              ...(f.portfolio ? { url: f.portfolio } : {}),
              ...(f.linkedin ? { sameAs: [f.linkedin] } : {}),
              knowsAbout:
                f.name === 'Parth Kadiya'
                  ? [
                      'Website Development',
                      'Next.js',
                      'React',
                      'Frontend Engineering',
                      'Full Stack Development',
                      'Technical SEO',
                      'Software Architecture',
                      'Web Design',
                    ]
                  : [
                      'Digital Marketing',
                      'Meta Ads',
                      'Performance Marketing',
                      'Social Media Management',
                      'Brand Strategy',
                      'Search Engine Optimization (SEO)',
                      'Lead Generation',
                    ],
            })),
          },
          ...site.founders
            .filter((f) => f.image)
            .map((f) => ({
              '@context': 'https://schema.org',
              '@type': 'ImageObject',
              '@id': absolute(`${f.image}#photo-entity`),
              url: absolute(f.image!),
              contentUrl: absolute(f.image!),
              name: `${f.name} — Co-Founder & ${f.role} at Techie Growera`,
              caption: `${f.name}, Co-Founder and ${f.role} at Techie Growera`,
              description: `Portrait photograph of ${f.name}, Co-Founder and ${f.role} at Techie Growera digital agency in Ahmedabad, Gujarat, India.`,
              width: 1254,
              height: 1254,
              encodingFormat: 'image/webp',
              about: {
                '@type': 'Person',
                name: f.name,
                jobTitle: `Co-Founder & ${f.role}`,
                worksFor: {
                  '@type': 'Organization',
                  name: site.name,
                  url: site.url,
                },
              },
              author: {
                '@type': 'Organization',
                name: site.name,
                url: site.url,
              },
              creditText: site.name,
              copyrightNotice: `© ${new Date().getFullYear()} ${site.name}`,
            })),
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: absolute('/'),
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'About',
                item: absolute('/about'),
              },
            ],
          },
        ]}
      />
    </>
  );
}
