import { Breadcrumbs, CTA, SectionHeading } from '@/components/ui';
import { ServiceCards } from '@/components/cards';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Web, Creative & Marketing Services',
  'Explore website development, SEO, graphic design, video editing, social media, digital marketing and Meta Ads services from Techie Growera.',
  '/services',
);
export default function Services() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Services', href: '/services' }]} />
          <span className="eyebrow">WEB · CREATIVE · GROWTH</span>
          <h1>
            The right expertise.
            <br />A connected approach.
          </h1>
          <p className="intro">
            Start with the service your business needs today. Build a stronger digital presence as
            your goals evolve.
          </p>
        </div>
      </section>
      <section className="section container">
        <SectionHeading label="OUR EXPERTISE" title="What can we help you build?" />
        <div style={{ marginTop: 40 }}>
          <ServiceCards />
        </div>
      </section>
      <CTA />
    </>
  );
}
