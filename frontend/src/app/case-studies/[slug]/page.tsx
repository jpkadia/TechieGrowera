import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudies } from '@/content/editorial';
import { getService } from '@/content/services';
import { Breadcrumbs, CTA, CheckList } from '@/components/ui';
import { pageMetadata } from '@/lib/site';
export const dynamicParams = false;
export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = caseStudies.find((s) => s.slug === slug);
  return s ? pageMetadata(s.title, s.description, `/case-studies/${s.slug}`, s.demo) : {};
}
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = caseStudies.find((s) => s.slug === slug);
  if (!s) notFound();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Case studies', href: '/case-studies' },
              { label: s.client, href: `/case-studies/${s.slug}` },
            ]}
          />
          <span className="eyebrow">{s.industry.toUpperCase()} · CONCEPT CASE STUDY</span>
          <h1>{s.title}</h1>
          <p className="intro">{s.description}</p>
          <p className="demo-notice">
            {s.client} is a fictional demo brand. This concept is not a completed client engagement.
          </p>
        </div>
      </section>
      <section className="section container split">
        <article className="prose">
          <h2>The brief</h2>
          <p>{s.problem}</p>
          <h2>The proposed solution</h2>
          <p>{s.solution}</p>
          <h2>Deliverables and limitations</h2>
          <p>{s.results}</p>
        </article>
        <aside className="content-panel">
          <h2>Project details</h2>
          <p>
            <strong>Brand:</strong> {s.client} (demo)
            <br />
            <strong>Industry:</strong> {s.industry}
          </p>
          <CheckList items={s.technologies} />
          <div className="related-links">
            {s.services.map((slug) => (
              <Link href={`/services/${slug}`} key={slug}>
                {getService(slug)?.name} ↗
              </Link>
            ))}
          </div>
        </aside>
      </section>
      <CTA />
    </>
  );
}
