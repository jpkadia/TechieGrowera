import { Breadcrumbs, CTA } from '@/components/ui';
import { WorkCard } from '@/components/cards';
import { getCaseStudies } from '@/lib/published-content';
import { pageMetadata } from '@/lib/site';
export async function generateMetadata() {
  const caseStudies = await getCaseStudies();
  return pageMetadata(
    'Case Studies & Project Thinking',
    'Read the brief, approach and deliverables behind Techie Growera’s illustrative website and creative concept projects.',
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
            The thinking is
            <br />
            part of the work.
          </h1>
          <p className="intro">
            Explore the problem, creative direction and proposed solution behind each concept. Real
            client outcomes will be published only with verified information and permission.
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
