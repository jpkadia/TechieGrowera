import Link from 'next/link';
import {
  ArrowUpRight,
  Code2,
  Search,
  PenTool,
  Clapperboard,
  MessagesSquare,
  Target,
  Megaphone,
} from 'lucide-react';
import { services } from '@/content/services';
import type { CaseStudy, BlogPost } from '@/content/editorial';
const icons = [Code2, Search, PenTool, Clapperboard, MessagesSquare, Target, Megaphone];
export function ServiceCards() {
  return (
    <div className="service-grid">
      {services.map((s, i) => {
        const Icon = icons[i];
        return (
          <Link className="service-card" key={s.slug} href={`/services/${s.slug}`}>
            <div className="card-top">
              <Icon size={27} strokeWidth={1.5} aria-hidden="true" />
              <span>0{i + 1}</span>
            </div>
            <h3>{s.name}</h3>
            <p>{s.short}</p>
            <span className="card-arrow">
              <ArrowUpRight size={21} aria-hidden="true" />
              <span className="sr-only">Explore {s.name}</span>
            </span>
          </Link>
        );
      })}
      <div className="service-card service-help">
        <span className="eyebrow">FIND YOUR STARTING POINT</span>
        <h3>
          Not sure what
          <br />
          you need yet?
        </h3>
        <Link href="/contact">
          Let’s figure it out <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
export function WorkCard({ study }: { study: CaseStudy }) {
  return (
    <article className="work-card">
      <Link
        href={`/case-studies/${study.slug}`}
        aria-label={`View ${study.client} concept`}
        className={`work-visual ${study.theme}`}
      >
        <span className="concept-label">CONCEPT PROJECT · NOT CLIENT WORK</span>
        <div className="project-identity">
          <span>{study.theme === 'studio' ? 'N /' : 'df.'}</span>
          <h3>
            {study.client}
            <span>
              {study.theme === 'studio' ? 'Spaces for living well.' : 'Good design. Every day.'}
            </span>
          </h3>
        </div>
        <span className="work-bottom">
          {study.industry}
          <ArrowUpRight size={24} aria-hidden="true" />
        </span>
      </Link>
      <div className="work-caption">
        <div>
          <h3>
            <Link href={`/case-studies/${study.slug}`}>{study.title}</Link>
          </h3>
          <p>{study.description}</p>
        </div>
        <span className="pill">Demo</span>
      </div>
    </article>
  );
}
export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  return (
    <article className="blog-card">
      <Link
        href={`/blog/${post.slug}`}
        className={`article-art art-${index % 3}`}
        aria-label={post.title}
      >
        <span>{post.category}</span>
        <strong>
          {
            [
              'Build for\nwhat’s next.',
              'Make it\nmean something.',
              'Start with\na better question.',
            ][index % 3]
          }
        </strong>
        <ArrowUpRight size={28} aria-hidden="true" />
      </Link>
      <div className="blog-meta">
        {post.category}
        <span>•</span>
        {new Date(post.publishedAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </div>
      <h3>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p>{post.excerpt}</p>
    </article>
  );
}
