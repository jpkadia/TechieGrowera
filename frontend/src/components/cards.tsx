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
import { type PortfolioItem, type BlogPost, getPostBoxTitle } from '@/content/editorial';
const icons = [Code2, Search, PenTool, Clapperboard, MessagesSquare, Target, Megaphone];
export function ServiceCards() {
  return (
    <div className="service-grid">
      {services.map((s, i) => {
        const Icon = icons[i];
        return (
          <Link className="service-card" key={s.slug} href={`/services/${s.slug}`} scroll={true}>
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
        <Link href="/contact" scroll={true}>
          Let’s figure it out <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
export function WorkCard({
  project,
  study,
}: {
  project?: PortfolioItem;
  study?: PortfolioItem;
}) {
  const item = (project || study)!;
  const initial = item.client ? item.client.slice(0, 1) : 'P';
  const theme = item.theme || 'studio';
  return (
    <article className="work-card">
      <Link
        href={`/portfolio/${item.slug}`}
        scroll={true}
        aria-label={`View ${item.client || item.title} ${item.demo ? 'concept' : 'portfolio project'}`}
        className={`work-visual ${theme}`}
      >
        <span className="concept-label">
          {item.demo ? 'CONCEPT PROJECT · NOT CLIENT WORK' : 'PORTFOLIO PROJECT'}
        </span>
        <div className="project-identity">
          <span>
            {item.demo ? (theme === 'studio' ? 'N /' : 'df.') : initial}
          </span>
          <h3>
            {item.client || item.title}
            <span>
              {item.demo
                ? theme === 'studio'
                  ? 'Spaces for living well.'
                  : 'Good design. Every day.'
                : item.industry}
            </span>
          </h3>
        </div>
        <span className="work-bottom">
          {item.industry}
          <ArrowUpRight size={24} aria-hidden="true" />
        </span>
      </Link>
      <div className="work-caption">
        <div>
          <h3>
            <Link href={`/portfolio/${item.slug}`} scroll={true}>{item.title}</Link>
          </h3>
          <p>{item.description}</p>
        </div>
        <span className="pill">{item.demo ? 'Demo' : 'Portfolio'}</span>
      </div>
    </article>
  );
}
export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  const boxTitle = getPostBoxTitle(post);
  return (
    <article className="blog-card">
      <Link
        href={`/blog/${post.slug}`}
        scroll={true}
        className={`article-art art-${index % 3}`}
        aria-label={post.title}
      >
        <span>{post.category}</span>
        <strong>{boxTitle}</strong>
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
        <Link href={`/blog/${post.slug}`} scroll={true}>{post.title}</Link>
      </h3>
      <p>{post.excerpt}</p>
    </article>
  );
}
