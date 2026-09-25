import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPortfolio } from '@/lib/published-content';
import { getService } from '@/content/services';
import { Breadcrumbs, CTA, CheckList, JsonLd } from '@/components/ui';
import { absolute, pageMetadata, site } from '@/lib/site';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const portfolio = await getPortfolio();
  return portfolio.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const portfolio = await getPortfolio();
  const project = portfolio.find((item) => item.slug === slug);
  return project ? pageMetadata(project.title, project.description, `/portfolio/${project.slug}`, project.demo) : {};
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const portfolio = await getPortfolio();
  const project = portfolio.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Portfolio', href: '/portfolio' },
              { label: project.client || project.title, href: `/portfolio/${project.slug}` },
            ]}
          />
          <span className="eyebrow">
            {(project.industry || 'Project').toUpperCase()} · {project.demo ? 'CONCEPT PROJECT' : 'PORTFOLIO PROJECT'}
          </span>
          <h1>{project.title}</h1>
          <p className="intro">{project.description}</p>
          {project.demo && (
            <p className="demo-notice">
              {project.client} is a fictional demo brand. This concept is not a completed client
              engagement.
            </p>
          )}
        </div>
      </section>
      <section className="section container split">
        <article className="prose">
          <h2>The brief</h2>
          <p>{project.problem}</p>
          <h2>{project.demo ? 'The proposed solution' : 'The solution'}</h2>
          <p>{project.solution}</p>
          <h2>{project.demo ? 'Deliverables and limitations' : 'Deliverables and outcomes'}</h2>
          <p>{project.results}</p>
        </article>
        <aside className="content-panel">
          <h2>Project details</h2>
          <p>
            <strong>Brand:</strong> {project.client} {project.demo ? '(demo)' : ''}
            <br />
            <strong>Industry:</strong> {project.industry || 'N/A'}
            <br />
            <strong>Pricing:</strong> Custom scoped upon consultation
          </p>
          <CheckList items={project.technologies || []} />
          <div className="related-links">
            {(project.services || []).map((serviceSlug) => (
              <Link href={`/services/${serviceSlug}`} key={serviceSlug}>
                {getService(serviceSlug)?.name} ↗
              </Link>
            ))}
          </div>
        </aside>
      </section>
      <CTA />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          '@id': absolute(`/portfolio/${project.slug}#project`),
          name: project.title,
          headline: project.title,
          description: project.description,
          url: absolute(`/portfolio/${project.slug}`),
          image: absolute(`/portfolio/${project.slug}/opengraph-image`),
          ...(project.updatedAt && { dateModified: `${project.updatedAt}T00:00:00+05:30` }),
          author: {
            '@id': absolute('/#organization'),
            '@type': 'Organization',
            name: site.name,
            url: site.url,
          },
          creator: {
            '@id': absolute('/#organization'),
            '@type': 'Organization',
            name: site.name,
            url: site.url,
          },
          publisher: {
            '@id': absolute('/#organization'),
          },
          ...(project.client
            ? {
                sourceOrganization: {
                  '@type': 'Organization',
                  name: project.client,
                },
              }
            : {}),
          genre: project.industry || 'Digital Solutions',
          keywords: [
            ...(project.technologies || []),
            project.industry,
            'Web Development',
            'Portfolio Project',
          ]
            .filter(Boolean)
            .join(', '),
          abstract: project.problem,
          text: project.solution,
          inLanguage: 'en-IN',
          mainEntityOfPage: absolute(`/portfolio/${project.slug}`),
        }}
      />
    </>
  );
}
