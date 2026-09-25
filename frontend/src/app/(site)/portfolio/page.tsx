import { Breadcrumbs, CTA } from '@/components/ui';
import { WorkCard } from '@/components/cards';
import { getPortfolio } from '@/lib/published-content';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Portfolio & Client Work',
  'Explore Techie Growera’s featured client portfolio projects and production web applications across healthcare, AI, and digital commerce.',
  '/portfolio',
);

export default async function Portfolio() {
  const portfolio = await getPortfolio();
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
            Browse our featured client portfolio projects and digital applications. Open each project to explore
            the engineering architecture, design systems, and measured results. Every solution is custom-scoped
            to drive tangible growth for your business.
          </p>
        </div>
      </section>
      <section className="section container">
        <div className="work-grid">
          {portfolio.map((item) => (
            <WorkCard project={item} key={item.slug} />
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
