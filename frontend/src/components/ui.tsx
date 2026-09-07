import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Check } from 'lucide-react';
import { absolute } from '@/lib/site';
import type { FAQ } from '@/content/services';
export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`button ${secondary ? 'button-secondary' : ''}`} href={href}>
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}
export function SectionHeading({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">
        <span />
        {label}
      </span>
      <h2>{title.replace(/\\n/g, '\n')}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  const all = [{ label: 'Home', href: '/' }, ...items];
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {all.map((item, i) => (
            <li key={item.href}>
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.label,
            item: absolute(item.href),
          })),
        }}
      />
    </>
  );
}
export function FAQList({ items }: { items: FAQ[] }) {
  return (
    <>
      <div className="faq-list">
        {items.map((faq, i) => (
          <details key={faq.question}>
            <summary>
              <span className="faq-number">{String(i + 1).padStart(2, '0')}</span>
              {faq.question}
              <span className="faq-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }}
      />
    </>
  );
}
export function CTA() {
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <div>
          <span className="eyebrow light">
            <span />
            YOUR NEXT CHAPTER
          </span>
          <h2>
            Good things start
            <br />
            with a conversation.
          </h2>
          <p>Tell us what you’re building. Let’s find the right way forward.</p>
        </div>
        <ButtonLink href="/contact">Let’s talk about your project</ButtonLink>
      </div>
    </section>
  );
}
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>
          <Check size={18} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}
