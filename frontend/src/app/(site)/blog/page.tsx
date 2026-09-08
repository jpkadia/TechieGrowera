import { Breadcrumbs, CTA } from '@/components/ui';
import { BlogCard } from '@/components/cards';
import { getPosts } from '@/lib/published-content';
import { pageMetadata } from '@/lib/site';
import { getService } from '@/content/services';
import Link from 'next/link';
export const metadata = pageMetadata(
  'Insights on Web, Creative & Growth',
  'Practical articles on website planning, content strategy and campaign preparation from Techie Growera.',
  '/blog',
);
export default async function Blog({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const posts = await getPosts();
  const service = getService((await searchParams).service || '');
  const filtered = service ? posts.filter(post => post.service === service.slug) : posts;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }]} />
          <span className="eyebrow">THE GROWERA JOURNAL</span>
          <h1>
            Web, creative &amp; growth
            <br />insights.
          </h1>
          <p className="intro">
            Practical thinking on the web, creative and digital growth decisions your business
            makes.
          </p>
        </div>
      </section>
      <section className="section container">
        {service && <p>Guides related to {service.name}. <Link href="/blog">View all articles</Link></p>}
        {!filtered.length && <p>No articles are published for this service yet. <Link href="/blog">Explore all insights</Link>.</p>}
        <div className="blog-grid">
          {filtered.map((p, i) => (
            <BlogCard key={p.slug} post={p} index={i} />
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
