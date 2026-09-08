import { Fragment } from 'react';
import Link from 'next/link';

// A deliberately small plain-text format, never arbitrary HTML or executable Markdown.
export function safeEditorialHref(value: string): string | null {
  if (/[\s\\\u0000-\u001f]/.test(value)) return null;
  if (/^\/(?!\/)/.test(value)) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
function inline(text: string) {
  const parts = text.split(/(\[[^\]\n]+\]\([^\s)]+\))/g);
  return parts.map((part, index) => {
    const match = /^\[([^\]\n]+)\]\(([^\s)]+)\)$/.exec(part);
    const href = match && safeEditorialHref(match[2]);
    return href ? (
      <Link key={index} href={href} prefetch={false}>
        {match![1]}
      </Link>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    );
  });
}
export function EditorialParagraph({ text }: { text: string }) {
  const lines = text.trim().split('\n');
  if (lines.every((line) => /^-\s+/.test(line)))
    return (
      <ul>
        {lines.map((line, index) => (
          <li key={index}>{inline(line.replace(/^-\s+/, ''))}</li>
        ))}
      </ul>
    );
  if (lines.every((line) => /^\d+\.\s+/.test(line)))
    return (
      <ol>
        {lines.map((line, index) => (
          <li key={index}>{inline(line.replace(/^\d+\.\s+/, ''))}</li>
        ))}
      </ol>
    );
  return <p>{inline(text)}</p>;
}
