import { Breadcrumbs, CTA } from '@/components/ui';
import { BlogCard } from '@/components/cards';
import { getPosts } from '@/lib/published-content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Insights on Web, Creative & Growth',
  'Practical articles on website planning, content strategy and campaign preparation from Techie Growera.',
  '/blog',
);
export default async function Blog() {
  const posts = await getPosts();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }]} />
          <span className="eyebrow">THE GROWERA JOURNAL</span>
          <h1>
            Useful ideas.
            <br />
            Clearer next steps.
          </h1>
          <p className="intro">
            Practical thinking on the web, creative and digital growth decisions your business
            makes.
          </p>
        </div>
      </section>
      <section className="section container">
        <div className="blog-grid">
          {posts.map((p, i) => (
            <BlogCard key={p.slug} post={p} index={i} />
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
