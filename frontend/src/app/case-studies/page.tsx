import { Breadcrumbs, CTA } from '@/components/ui';
import { WorkCard } from '@/components/cards';
import { caseStudies } from '@/content/editorial';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Case Studies & Project Thinking',
  'Read the brief, approach and deliverables behind Techie Growera’s illustrative website and creative concept projects.',
  '/case-studies',
  caseStudies.every((study) => study.demo),
);
export default function CaseStudies() {
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
          <p className="demo-notice">
            All current case studies are demos. No measured client results are claimed.
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
