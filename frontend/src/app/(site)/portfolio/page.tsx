import { Breadcrumbs, CTA } from '@/components/ui';
import { WorkCard } from '@/components/cards';
import { getCaseStudies } from '@/lib/published-content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Portfolio & Concept Work',
  'Explore clearly labelled concept projects demonstrating Techie Growera’s approach to website design, brand identity and creative systems.',
  '/portfolio',
);
export default async function Portfolio() {
  const caseStudies = await getCaseStudies();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Portfolio', href: '/portfolio' }]} />
          <span className="eyebrow">IDEAS MADE TANGIBLE</span>
          <h1>
            Our approach.
            <br />
            In a different light.
          </h1>
          <p className="intro">
            These concept projects explore how a clear strategy can become a distinctive digital
            experience. They are illustrative work, not commissioned client projects.
          </p>
        </div>
      </section>
      <section className="section container">
        <div className="work-grid">
          {caseStudies.map((s) => (
            <WorkCard study={s} key={s.slug} />
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
