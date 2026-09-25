'use client';

import { useEffect, useState } from 'react';
import { BlogCard, WorkCard } from '@/components/cards';
import { SkeletonCard } from '@/components/skeleton-card';
import { portfolio as fallbackPortfolio, posts as fallbackPosts, type BlogPost, type PortfolioItem } from '@/content/editorial';

type Props =
  | { kind: 'blog'; initialItems: BlogPost[] | null }
  | { kind: 'portfolio'; initialItems: PortfolioItem[] | null };

// Only optional cards load after hydration. The server-rendered homepage, links,
// metadata and business content never wait for this request, for any user agent.
export function HomepageCards({ kind, initialItems }: Props) {
  const [items, setItems] = useState<(BlogPost | PortfolioItem)[] | null>(initialItems);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (initialItems !== null) return;
    const controller = new AbortController();
    // Relaxed 45s timer to allow Render container to finish booting
    const timer = setTimeout(() => controller.abort(), 45000);
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
        // If upstream backend is sleeping or unavailable, switch to fallback
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

  // If failed, seamlessly fall back to verified editorial records so user is never stuck
  const activeItems =
    items ??
    (failed
      ? kind === 'portfolio'
        ? fallbackPortfolio.slice(0, 2)
        : fallbackPosts.slice(0, 3)
      : null);

  // While waiting for backend response, show YouTube / Instagram style shimmer wave
  if (activeItems === null) {
    return kind === 'blog' ? (
      <div className="blog-grid" role="status" aria-label="Loading latest blog previews">
        <SkeletonCard type="blog" />
        <SkeletonCard type="blog" />
        <SkeletonCard type="blog" />
      </div>
    ) : (
      <div className="work-grid" role="status" aria-label="Loading latest project previews">
        <SkeletonCard type="work" />
        <SkeletonCard type="work" />
      </div>
    );
  }

  if (!activeItems.length)
    return <p>New {kind === 'blog' ? 'blog posts' : 'portfolio projects'} will appear here.</p>;

  return kind === 'blog' ? (
    <div className="blog-grid">
      {(activeItems as BlogPost[]).map((post, index) => (
        <BlogCard key={post.slug} post={post} index={index} />
      ))}
    </div>
  ) : (
    <div className="work-grid">
      {(activeItems as PortfolioItem[]).map((project) => (
        <WorkCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
