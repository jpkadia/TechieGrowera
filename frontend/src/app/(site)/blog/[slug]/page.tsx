import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/published-content';
import { getService } from '@/content/services';
import { Breadcrumbs, CTA, JsonLd, SectionHeading, TextLink } from '@/components/ui';
import { BlogCard } from '@/components/cards';
import { absolute, pageMetadata } from '@/lib/site';
export const dynamicParams = true;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const p = posts.find((p) => p.slug === slug);
  if (!p) return {};
  const base = pageMetadata(p.seoTitle, p.metaDescription, p.canonicalPath);
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: p.publishedAt,
      modifiedTime: p.updatedAt,
      authors: [p.author],
    },
  };
}
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const p = posts.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: p.category, href: `/blog/${p.slug}` },
            ]}
          />
          <span className="eyebrow">{p.category.toUpperCase()}</span>
          <h1>{p.title}</h1>
          <p className="intro">{p.excerpt}</p>
          <div className="article-byline">
            <span>By {p.author}</span>
            <time dateTime={p.publishedAt}>Published {p.publishedAt}</time>
            <time dateTime={p.updatedAt}>Updated {p.updatedAt}</time>
          </div>
        </div>
      </section>
      <div className="section container article-layout">
        <article className="prose">
          {p.sections.map((section, i) => (
            <section key={section.heading} id={`section-${i}`}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </section>
          ))}
          <div className="content-panel">
            <h2>Put the thinking into practice</h2>
            <p>
              Need help applying this to your business? Explore our{' '}
              <Link href={`/services/${p.service}`}>
                {getService(p.service)?.name.toLowerCase()}
              </Link>{' '}
              service or <Link href="/contact">share your project brief</Link>.
            </p>
          </div>
        </article>
        <aside>
          <h2>In this article</h2>
          {p.sections.map((section, i) => (
            <a key={section.heading} href={`#section-${i}`}>
              {section.heading}
            </a>
          ))}
          <TextLink href={`/services/${p.service}`}>Explore the related service</TextLink>
        </aside>
      </div>
      <section className="container section" style={{ paddingTop: 0 }}>
        <SectionHeading label="KEEP EXPLORING" title="More useful perspectives." />
        <div className="blog-grid" style={{ marginTop: 35 }}>
          {posts
            .filter((post) => post.slug !== slug)
            .map((post, i) => (
              <BlogCard post={post} index={i} key={post.slug} />
            ))}
        </div>
      </section>
      <CTA />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: p.title,
          description: p.excerpt,
          image: absolute(p.ogImage),
          datePublished: `${p.publishedAt}T00:00:00+05:30`,
          dateModified: `${p.updatedAt}T00:00:00+05:30`,
          author: { '@type': 'Organization', name: p.author, url: absolute('/about') },
          publisher: { '@id': absolute('/#organization') },
          mainEntityOfPage: absolute(p.canonicalPath),
          articleSection: p.category,
          keywords: p.tags.join(', '),
        }}
      />
    </>
  );
}
