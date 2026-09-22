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
              <article key={founder.name} className="founder-card">
                {founder.image ? (
                  <Image
                    src={founder.image}
                    alt={`${founder.name} — Co-Founder & ${founder.role} at Techie Growera`}
                    width={112}
                    height={112}
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
                <h3>{founder.name}</h3>
                <p>{founder.role}</p>
                {(founder.portfolio || founder.linkedin) && (
                  <div className="founder-links">
                    {founder.portfolio && (
                      <a
                        href={founder.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="founder-link"
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
            isPartOf: { '@id': absolute('/#website') },
            mainEntity: site.founders.map((f) => ({
              '@type': 'Person',
              '@id': absolute(`/about#${f.name.toLowerCase().replace(/\s+/g, '-')}`),
              name: f.name,
              jobTitle: f.role,
              worksFor: { '@id': absolute('/#organization') },
              ...(f.image
                ? {
                    image: {
                      '@type': 'ImageObject',
                      url: absolute(f.image),
                      caption: `${f.name} — Co-Founder & ${f.role} at Techie Growera`,
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
                      'Technical SEO',
                      'Software Architecture',
                    ]
                  : [
                      'Digital Marketing',
                      'Meta Ads',
                      'Performance Marketing',
                      'Social Media Management',
                      'Brand Strategy',
                    ],
            })),
          },
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
