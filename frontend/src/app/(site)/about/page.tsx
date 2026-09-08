import { Breadcrumbs, ButtonLink, CTA, SectionHeading, CheckList } from '@/components/ui';
import { pageMetadata, site } from '@/lib/site';
export const metadata = pageMetadata(
  'About Our Digital Agency',
  'Meet the thinking behind Techie Growera: a connected approach to web development, creative services and sustainable digital growth.',
  '/about',
);
export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'About', href: '/about' }]} />
          <span className="eyebrow">THE THINKING BEHIND THE WORK</span>
          <h1>
            About
            <br />Techie Growera.
          </h1>
          <p className="intro">
            Techie Growera helps businesses build and grow their digital presence. We connect the
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
      <section className="why-section section">
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
            {site.founders.map(({ name, role }) => (
              <article key={name} className="founder-card">
                <span aria-hidden="true" className="founder-initials">
                  {name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <h3>{name}</h3>
                <p>{role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
