import { Breadcrumbs, CTA } from '@/components/ui';
import { WorkCard } from '@/components/cards';
import { getCaseStudies } from '@/lib/published-content';
import { pageMetadata } from '@/lib/site';
export async function generateMetadata() {
  const caseStudies = await getCaseStudies();
  return pageMetadata(
    'Case Studies & Client Results',
    'Explore the brief, engineering approach and deliverables behind Techie Growera client projects.',
    '/case-studies',
    caseStudies.every((study) => study.demo),
  );
}
export default async function CaseStudies() {
  const caseStudies = await getCaseStudies();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Case studies', href: '/case-studies' }]} />
          <span className="eyebrow">BEHIND THE DECISIONS</span>
          <h1>
            Project briefs.
            <br />Approach &amp; outcomes.
          </h1>
          <p className="intro">
            Go beyond the preview: understand each project’s core problem, architectural approach, and delivered results.
            Explore our real-world client engagements across web engineering, healthtech, and growth.
          </p>
          {caseStudies.every((study) => study.demo) && (
            <p className="demo-notice">
              Current concept case studies are demos. No measured client results are claimed.
            </p>
          )}
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
