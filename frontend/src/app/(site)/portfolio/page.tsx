import { Breadcrumbs, CTA } from '@/components/ui';
import { WorkCard } from '@/components/cards';
import { getCaseStudies } from '@/lib/published-content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Portfolio & Creative Work',
  'Explore Techie Growera’s website and creative project previews. Illustrative concepts are clearly labelled alongside project details.',
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
            Website &amp; creative
            <br />portfolio.
          </h1>
          <p className="intro">
            Browse our website and creative project previews, then open a case study to understand
            the brief and approach. Projects labelled as concepts are illustrative work, not
            commissioned client engagements.
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
