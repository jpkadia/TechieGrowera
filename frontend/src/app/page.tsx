import Image from 'next/image';
import { ArrowUpRight, Code2, Sparkles, Search, Check, MoveUpRight } from 'lucide-react';
import { ButtonLink, SectionHeading, CTA, FAQList, TextLink } from '@/components/ui';
import { ServiceCards, WorkCard, BlogCard } from '@/components/cards';
import { generalFaqs } from '@/content/services';
import { caseStudies, posts } from '@/content/editorial';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Web, Creative & Digital Growth Agency',
  'Techie Growera brings website development, SEO, design, video, social media and performance marketing together to grow your digital presence.',
  '/',
);
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span />
              WEB. CREATIVE. GROWTH.
            </span>
            <h1>
              Your brand.
              <br />
              Engineered
              <br />
              <span>to grow.</span>
              <span className="headline-dot">↗</span>
            </h1>
            <p>
              We build websites, shape brands and connect you with the right people. Technology,
              creativity and digital marketing — working together.
            </p>
            <div className="button-row">
              <ButtonLink href="/contact">Start a project</ButtonLink>
              <ButtonLink href="/services" secondary>
                Explore our services
              </ButtonLink>
            </div>
            <div className="hero-note">
              <span className="note-line" />A clear strategy. Thoughtful execution. Lasting value.
            </div>
          </div>
          <div className="hero-art" aria-label="Techie Growera: web, creative and growth">
            <div className="art-topline">
              <span>IDEAS INTO IMPACT</span>
              <span>↗</span>
            </div>
            <div className="brand-orbit">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <Image
                style={{ height: 'auto' }}
                src="/brand/mark.svg"
                alt="Techie Growera growth monogram"
                width={325}
                height={285}
                priority
                className="hero-mark"
              />
              <span className="orbit-dot" />
            </div>
            <div className="floating-label label-web">
              <Code2 size={18} aria-hidden="true" />
              Web development
            </div>
            <div className="floating-label label-creative">
              <Sparkles size={18} aria-hidden="true" />
              Creative thinking
            </div>
            <div className="floating-label label-growth">
              <MoveUpRight size={18} aria-hidden="true" />
              Digital growth
            </div>
            <div className="art-bottomline">
              <span>BUILT WITH PURPOSE.</span>
              <span>DESIGNED FOR WHAT’S NEXT.</span>
            </div>
          </div>
        </div>
      </section>
      <div className="value-strip">
        <div className="container">
          <span>
            More than a website.
            <br />
            <strong>A stronger digital presence.</strong>
          </span>
          {['Strategy before execution', 'Design with intention', 'Built for the long run'].map(
            (text) => (
              <span key={text}>
                <Check size={17} aria-hidden="true" />
                {text}
              </span>
            ),
          )}
        </div>
      </div>
      <section className="section container" id="services">
        <div className="heading-row">
          <SectionHeading
            label="WHAT WE DO"
            title="Everything your brand needs.\nOne connected team."
            text="From the first impression to the next conversion, we connect the dots across your digital presence."
          />
          <TextLink href="/services">Explore all services</TextLink>
        </div>
        <ServiceCards />
      </section>
      <section className="why-section section">
        <div className="container split">
          <div>
            <SectionHeading
              label="THE TECHIE GROWERA APPROACH"
              title="Good design meets\nclear thinking."
            />
            <p className="lead">
              Your business deserves more than a collection of disconnected services. We see the
              whole picture — and make each part work harder together.
            </p>
            <TextLink href="/about">Meet your digital growth partner</TextLink>
          </div>
          <div className="principles">
            {[
              [
                '01',
                'Business first. Always.',
                'We start with your goals and your customers, then choose the right tools for the job.',
              ],
              [
                '02',
                'Creative, with a reason.',
                'Every layout, word and campaign has a purpose beyond looking good.',
              ],
              [
                '03',
                'Clarity at every step.',
                'Defined scope, honest conversations and a process you can follow.',
              ],
            ].map(([n, h, p]) => (
              <div key={n}>
                <span>{n}</span>
                <div>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="feature-grid">
          <div className="feature-main">
            <Code2 size={31} aria-hidden="true" />
            <span className="eyebrow light">YOUR DIGITAL FOUNDATION</span>
            <h2>
              A website that works
              <br />
              as hard as you do.
            </h2>
            <p>
              Responsive websites and landing pages that make your business clear, your content
              discoverable and the next step effortless.
            </p>
            <TextLink href="/services/web-development">Explore website development</TextLink>
            <div className="feature-tags">
              <span>Responsive by design</span>
              <span>SEO foundations</span>
              <span>Built for speed</span>
            </div>
          </div>
          <div className="feature-side">
            <Sparkles size={28} aria-hidden="true" />
            <h2>
              Make your brand
              <br />
              impossible to mistake.
            </h2>
            <p>
              From visual identity to a perfectly paced reel, build a consistent creative presence.
            </p>
            <TextLink href="/services/graphic-design">Graphic design</TextLink>
            <TextLink href="/services/video-editing">Video editing</TextLink>
          </div>
        </div>
      </section>
      <section className="container growth-section">
        <SectionHeading
          label="MAKE THE RIGHT CONNECTIONS"
          title="Be found. Be remembered.\nGive people a reason to act."
        />
        <div className="growth-grid">
          {[
            [
              'seo',
              'Search with substance.',
              'Technical SEO and useful content that help the right people discover what you do.',
              'Explore SEO',
            ],
            [
              'social-media-management',
              'A presence with purpose.',
              'A considered content plan and consistent creative that keep your brand in the conversation.',
              'Explore social media',
            ],
            [
              'meta-ads',
              'Performance with perspective.',
              'Thoughtful campaigns, creative testing and transparent reporting built around your goals.',
              'Explore Meta Ads',
            ],
          ].map(([slug, title, description, link], i) => (
            <article key={slug}>
              <span className="growth-icon">
                {i === 0 ? (
                  <Search aria-hidden="true" />
                ) : i === 1 ? (
                  <Sparkles aria-hidden="true" />
                ) : (
                  <ArrowUpRight aria-hidden="true" />
                )}
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
              <TextLink href={`/services/${slug}`}>{link}</TextLink>
            </article>
          ))}
        </div>
      </section>
      <section className="section process-section">
        <div className="container">
          <SectionHeading label="HOW WE WORK" title="A clear path from idea to impact." />
          <div className="process-grid">
            {[
              ['Discover', 'We listen, ask the right questions and understand your business.'],
              ['Define', 'We align on a focused strategy, scope and direction.'],
              ['Create', 'We design, build and refine with you at every milestone.'],
              ['Grow', 'We launch, learn and identify the next useful improvement.'],
            ].map(([title, text], i) => (
              <article key={title}>
                <span className="step-number">
                  0{i + 1}
                  <span>↗</span>
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="heading-row">
          <SectionHeading
            label="A LOOK AT THE POSSIBILITIES"
            title="Thoughtful work.\nPurposeful outcomes."
            text="Explore our concept projects — a window into our approach, clearly presented as illustrative work."
          />
          <TextLink href="/portfolio">View our work</TextLink>
        </div>
        <div className="work-grid">
          {caseStudies.map((s) => (
            <WorkCard key={s.slug} study={s} />
          ))}
        </div>
        <div className="case-link">
          <p>Curious about the thinking behind the work?</p>
          <TextLink href="/case-studies">Explore the concept case studies</TextLink>
        </div>
      </section>
      <section className="industries">
        <div className="container">
          <span className="eyebrow">BUILT AROUND YOUR BUSINESS</span>
          <h2>
            Different industries.
            <br />
            The same thoughtful approach.
          </h2>
          <div>
            {[
              'Professional services',
              'Local businesses',
              'Retail & e-commerce',
              'Education',
              'Lifestyle brands',
              'Startups',
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="heading-row">
          <SectionHeading label="IDEAS & INSIGHTS" title="A little clarity goes a long way." />
          <TextLink href="/blog">Read all insights</TextLink>
        </div>
        <div className="blog-grid">
          {posts.map((p, i) => (
            <BlogCard key={p.slug} post={p} index={i} />
          ))}
        </div>
      </section>
      <section className="section container faq-section">
        <SectionHeading label="GOOD QUESTIONS" title="Let’s clear a few things up." />
        <FAQList items={generalFaqs} />
      </section>
      <CTA />
    </>
  );
}
