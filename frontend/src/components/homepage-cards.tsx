'use client';

import { useEffect, useState } from 'react';
import { BlogCard, WorkCard } from '@/components/cards';
import type { BlogPost, CaseStudy } from '@/content/editorial';

type Props =
  | { kind: 'blog'; initialItems: BlogPost[] | null }
  | { kind: 'case-studies'; initialItems: CaseStudy[] | null };

// Only optional cards load after hydration. The server-rendered homepage, links,
// metadata and business content never wait for this request, for any user agent.
export function HomepageCards({ kind, initialItems }: Props) {
  const [items, setItems] = useState<(BlogPost | CaseStudy)[] | null>(initialItems);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (initialItems !== null) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    let active = true;
    async function load() {
      try {
        const response = await fetch(`/api/highlights/${kind}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Highlights unavailable');
        const data = await response.json();
        if (!data.ok || !Array.isArray(data.items)) throw new Error('Invalid highlights');
        if (active) setItems(data.items);
      } catch {
        if (active) setFailed(true);
      } finally {
        clearTimeout(timer);
      }
    }
    void load();
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [kind, initialItems]);

  if (items === null)
    return (
      <p role="status" style={{ minHeight: 64 }}>
        {failed
          ? 'These previews are temporarily unavailable. Please try again later.'
          : 'Loading the latest previews…'}
      </p>
    );
  if (!items.length)
    return <p>New {kind === 'blog' ? 'articles' : 'projects'} will appear here.</p>;
  return kind === 'blog' ? (
    <div className="blog-grid">
      {(items as BlogPost[]).map((post, index) => (
        <BlogCard key={post.slug} post={post} index={index} />
      ))}
    </div>
  ) : (
    <div className="work-grid">
      {(items as CaseStudy[]).map((study) => (
        <WorkCard key={study.slug} study={study} />
      ))}
    </div>
  );
}
