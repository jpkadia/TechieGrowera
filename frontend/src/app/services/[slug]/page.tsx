import { notFound } from 'next/navigation';
import { services, getService } from '@/content/services';
import {
  Breadcrumbs,
  CTA,
  ButtonLink,
  SectionHeading,
  CheckList,
  FAQList,
  JsonLd,
} from '@/components/ui';
import { absolute, pageMetadata } from '@/lib/site';
import Link from 'next/link';
export const dynamicParams = false;
export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  return s ? pageMetadata(s.name, s.description, `/services/${s.slug}`) : {};
}
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Services', href: '/services' },
              { label: s.name, href: `/services/${s.slug}` },
            ]}
          />
          <span className="eyebrow">{s.eyebrow}</span>
          <h1>{s.title}</h1>
          <p className="intro">{s.intro}</p>
          <div className="button-row">
            <ButtonLink href={`/contact?service=${s.slug}`}>
              Discuss your {s.slug === 'seo' ? 'SEO' : 'project'}
            </ButtonLink>
            <ButtonLink href="#deliverables" secondary>
              What’s included
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="section container split">
        <div className="prose">
          <h2>The challenge</h2>
          <p>{s.problem}</p>
          <h2>How we help</h2>
          <p>{s.solution}</p>
        </div>
        <div className="content-panel">
          <h2>What this means for your business</h2>
          <CheckList items={s.benefits} />
        </div>
      </section>
      <section className="why-section section" id="deliverables">
        <div className="container split">
          <SectionHeading
            label="THE SCOPE"
            title="Thoughtful work.\nPractical deliverables."
            text="We agree the exact scope, formats and responsibilities with you before the project begins."
          />
          <CheckList items={s.deliverables} />
        </div>
      </section>
      <section className="section container">
        <SectionHeading label="THE PROCESS" title={`How we approach ${s.name.toLowerCase()}`} />
        <div className="process-grid">
          {s.process.map((step, i) => (
            <article key={step.title}>
              <span className="step-number">
                0{i + 1}
                <span>↗</span>
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container split section" style={{ paddingTop: 0 }}>
        <div>
          <SectionHeading
            label="WHY TECHIE GROWERA"
            title="A considered approach,\nfrom start to finish."
          />
          <p className="lead">{s.difference}</p>
        </div>
        <div className="content-panel">
          <h2>When this service is a good fit</h2>
          <CheckList items={s.useCases} />
        </div>
      </section>
      <section className="section container faq-section">
        <SectionHeading label="YOUR QUESTIONS" title="A few useful details." />
        <FAQList items={s.faqs} />
      </section>
      <section className="container section" style={{ paddingTop: 0 }}>
        <SectionHeading label="CONNECTED SERVICES" title="Keep the bigger picture in view." />
        <div className="related-links">
          {s.related.map((slug) => (
            <Link key={slug} href={`/services/${slug}`}>
              {getService(slug)?.name} ↗
            </Link>
          ))}
        </div>
      </section>
      <CTA />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.name,
          description: s.description,
          serviceType: s.name,
          url: absolute(`/services/${s.slug}`),
          provider: { '@id': absolute('/#organization') },
        }}
      />
    </>
  );
}
