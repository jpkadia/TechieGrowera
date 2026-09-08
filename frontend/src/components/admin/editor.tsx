'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { services } from '@/content/services';
import { adminApi } from './api';
import { AdminHeading, Notice } from './shared';
import type { ContentItem } from './content';
import { EditorialParagraph } from '@/components/editorial-paragraph';
type Section = { heading: string; paragraphs: string[] };
type Draft = {
  title: string;
  slug: string;
  excerpt?: string;
  author?: string;
  authorType?: 'Organization' | 'Person';
  category?: string;
  tags?: string[];
  featuredImage?: string;
  seoTitle?: string;
  metaDescription?: string;
  service?: string;
  sections?: Section[];
  client?: string;
  industry?: string;
  demo?: boolean;
  description?: string;
  problem?: string;
  solution?: string;
  results?: string;
  services?: string[];
  technologies?: string[];
  theme?: string;
};
function empty(kind: string): Draft {
  return kind === 'blog'
    ? {
        title: '',
        slug: '',
        excerpt: '',
        author: 'Techie Growera Editorial',
        category: '',
        tags: [],
        featuredImage: '/brand/mark.svg',
        seoTitle: '',
        metaDescription: '',
        service: 'web-development',
        sections: [{ heading: '', paragraphs: [''] }],
      }
    : {
        title: '',
        slug: '',
        client: '',
        industry: '',
        demo: true,
        description: '',
        problem: '',
        solution: '',
        results: '',
        services: ['web-development'],
        technologies: [],
        theme: 'studio',
      };
}
export function ContentEditor({ kind, id }: { kind: string; id: string }) {
  const router = useRouter();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [draft, setDraft] = useState<Draft>(() => empty(kind));
  const [loading, setLoading] = useState(id !== 'new');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    if (id === 'new') return;
    let active = true;
    adminApi<{ item: ContentItem }>(`content/${kind}/${id}`)
      .then((data) => {
        if (active) {
          setItem(data.item);
          setDraft(data.item.draft as Draft);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [kind, id]);
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    const guard = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (
        !link ||
        link.getAttribute('target') === '_blank' ||
        link.getAttribute('href')?.startsWith('#')
      )
        return;
      if (!window.confirm('Leave without saving your changes?')) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener('click', guard, true);
    return () => {
      window.removeEventListener('beforeunload', handler);
      document.removeEventListener('click', guard, true);
    };
  }, [dirty]);
  function change(key: keyof Draft, value: unknown) {
    setDraft((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setMessage('');
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await adminApi<{ id?: string; item?: ContentItem }>(
        `content/${kind}${id === 'new' ? '' : `/${id}`}`,
        id === 'new' ? 'POST' : 'PUT',
        { draft, ...(item ? { revision: item.revision } : {}) },
      );
      setDirty(false);
      if (response.id) {
        router.replace(`/admin/content/${kind}/${response.id}`);
      } else if (response.item) {
        setItem(response.item);
        setMessage('Draft saved. Publish when you are ready to update the website.');
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function transition() {
    if (!item) return;
    setBusy(true);
    setError('');
    try {
      await adminApi(`content/${kind}/${id}/${confirm}`, 'POST', { revision: item.revision });
      const data = await adminApi<{ item: ContentItem }>(`content/${kind}/${id}`);
      setItem(data.item);
      setDraft(data.item.draft as Draft);
      setMessage(
        confirm === 'publish'
          ? 'Published. Your website now uses this version.'
          : confirm === 'archive'
            ? 'Archived. This URL now returns 404 and is removed from the sitemap.'
            : 'Restored as a private draft.',
      );
      setConfirm('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function field(
    key: keyof Draft,
    label: string,
    options: { area?: boolean; max?: number; help?: string } = {},
  ) {
    const value = String(draft[key] ?? '');
    return (
      <label>
        {label}
        {options.area ? (
          <textarea
            rows={key === 'problem' || key === 'solution' || key === 'results' ? 6 : 3}
            value={value}
            maxLength={options.max || 6000}
            onChange={(e) => change(key, e.target.value)}
            required
          />
        ) : (
          <input
            value={value}
            maxLength={options.max || 140}
            disabled={key === 'slug' && item?.everPublished}
            onChange={(e) => change(key, e.target.value)}
            required
          />
        )}
        {options.help && <small>{options.help}</small>}
      </label>
    );
  }
  if (loading) return <p className="admin-loading">Loading editor…</p>;
  if (id !== 'new' && !item)
    return (
      <>
        <Notice text={error} error />
        <Link href={`/admin/content/${kind}`}>Back to content</Link>
      </>
    );
  return (
    <>
      <AdminHeading
        eyebrow={kind === 'blog' ? 'JOURNAL EDITOR' : 'CASE STUDY EDITOR'}
        title={id === 'new' ? 'Make something useful.' : 'Refine your story.'}
        text="Use clear, original content. Your changes stay private until you publish."
      >
        <Link href={`/admin/content/${kind}`}>← Back to list</Link>
      </AdminHeading>
      <Notice text={error} error />
      <Notice text={message} />
      <div className="admin-editor-status">
        <span className={`admin-badge ${item?.status || 'draft'}`}>
          {item?.status || 'New draft'}
        </span>
        <span>
          {dirty ? 'Unsaved changes' : item ? `Saved · Revision ${item.revision}` : 'Not saved yet'}
        </span>
        <button onClick={() => setPreview(!preview)}>
          {preview ? 'Back to editing' : 'Preview draft'}
        </button>
      </div>
      {confirm && (
        <div className="admin-confirm" role="region" aria-label="Confirm content action">
          <h2>
            {confirm === 'publish'
              ? 'Publish this saved draft?'
              : confirm === 'archive'
                ? 'Archive this page?'
                : 'Restore as a draft?'}
          </h2>
          <p>
            {confirm === 'publish'
              ? 'This replaces the live version. Review your content and SEO fields before continuing.'
              : confirm === 'archive'
                ? 'The public URL will return 404 and leave the sitemap. Existing external links will stop working. You can restore and republish later.'
                : 'The content will be editable again but will stay private until you publish.'}
          </p>
          <button className="admin-primary" disabled={busy} onClick={transition}>
            Confirm {confirm}
          </button>
          <button disabled={busy} onClick={() => setConfirm('')}>
            Cancel
          </button>
        </div>
      )}
      {preview ? (
        <article className="admin-panel admin-preview">
          <span className="admin-kicker">PRIVATE DRAFT PREVIEW</span>
          <h2>{draft.title || 'Untitled draft'}</h2>
          <p>{draft.excerpt || draft.description}</p>
          {kind === 'blog'
            ? draft.sections?.map((s, i) => (
                <section key={i}>
                  <h3>{s.heading}</h3>
                  {s.paragraphs.map((p, j) => (
                    <EditorialParagraph key={j} text={p} />
                  ))}
                </section>
              ))
            : [
                ['The challenge', draft.problem],
                ['Our approach', draft.solution],
                ['Outcomes', draft.results],
              ].map(([h, p]) => (
                <section key={h}>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </section>
              ))}
        </article>
      ) : (
        <form onSubmit={save} className="admin-editor">
          <div className="admin-editor-main">
            <section className="admin-panel admin-form-section">
              <h2>The essentials</h2>
              {field('title', 'Title', { max: 140 })}
              {field('slug', 'URL slug', {
                max: 100,
                help: item?.everPublished
                  ? 'Published URLs are locked to protect existing links.'
                  : 'Lowercase letters, numbers and hyphens. Example: planning-a-better-website',
              })}
              {kind === 'blog' ? (
                <>
                  {field('excerpt', 'Article summary', { area: true, max: 350 })}
                  <div className="admin-fields-two">
                    {field('author', 'Author', { max: 100 })}
                    <label>
                      Author type
                      <select
                        value={draft.authorType || 'Organization'}
                        onChange={(e) => change('authorType', e.target.value)}
                      >
                        <option value="Organization">Editorial team / organization</option>
                        <option value="Person">Individual author</option>
                      </select>
                    </label>
                    {field('category', 'Category', { max: 80 })}
                  </div>
                  <label>
                    Tags
                    <input
                      value={draft.tags?.join(', ') || ''}
                      onChange={(e) =>
                        change(
                          'tags',
                          e.target.value.split(',').map((v) => v.trim()),
                        )
                      }
                    />
                    <small>
                      Separate tags with commas. Remove any trailing comma before saving.
                    </small>
                  </label>
                </>
              ) : (
                <>
                  <div className="admin-fields-two">
                    {field('client', 'Client / concept brand', { max: 100 })}
                    {field('industry', 'Industry', { max: 100 })}
                  </div>
                  {field('description', 'Summary & search description', {
                    area: true,
                    max: 170,
                    help: '50–170 characters. Describe the project accurately.',
                  })}
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={draft.demo}
                      onChange={(e) => change('demo', e.target.checked)}
                    />
                    This is a fictional concept / demo project
                  </label>
                  <small>Demo case studies are labelled and excluded from search indexing.</small>
                </>
              )}
            </section>
            <section className="admin-panel admin-form-section">
              <h2>{kind === 'blog' ? 'Article sections' : 'The project story'}</h2>
              {kind === 'blog' ? (
                <>
                  {draft.sections?.map((section, index) => (
                    <div className="admin-section-editor" key={index}>
                      <div className="admin-panel-heading">
                        <h3>Section {index + 1}</h3>
                        <button
                          type="button"
                          disabled={draft.sections!.length === 1}
                          onClick={() =>
                            change(
                              'sections',
                              draft.sections!.filter((_, i) => i !== index),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                      <label>
                        Section heading
                        <input
                          value={section.heading}
                          required
                          maxLength={160}
                          onChange={(e) =>
                            change(
                              'sections',
                              draft.sections!.map((s, i) =>
                                i === index ? { ...s, heading: e.target.value } : s,
                              ),
                            )
                          }
                        />
                      </label>
                      <label>
                        Paragraphs
                        <textarea
                          rows={9}
                          value={section.paragraphs.join('\n\n')}
                          required
                          onChange={(e) =>
                            change(
                              'sections',
                              draft.sections!.map((s, i) =>
                                i === index
                                  ? { ...s, paragraphs: e.target.value.split('\n\n') }
                                  : s,
                              ),
                            )
                          }
                        />
                        <small>
                          Separate paragraphs with a blank line. Links:
                          [label](https://example.com). Lists: one item per line starting with - or
                          1. HTML is not accepted.
                        </small>
                      </label>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      change('sections', [...draft.sections!, { heading: '', paragraphs: [''] }])
                    }
                  >
                    + Add section
                  </button>
                </>
              ) : (
                <>
                  {field('problem', 'The challenge', { area: true })}
                  {field('solution', 'The solution', { area: true })}
                  {field('results', 'Outcomes & evidence', {
                    area: true,
                    help: 'Only include verified results. For concepts, state deliverables and limitations.',
                  })}
                  <label>
                    Technologies / capabilities
                    <input
                      value={draft.technologies?.join(', ') || ''}
                      onChange={(e) =>
                        change(
                          'technologies',
                          e.target.value.split(',').map((v) => v.trim()),
                        )
                      }
                    />
                    <small>Separate with commas.</small>
                  </label>
                  <label>
                    Card colour direction
                    <select value={draft.theme} onChange={(e) => change('theme', e.target.value)}>
                      <option value="studio">Studio / cool neutral</option>
                      <option value="daily">Daily / warm neutral</option>
                    </select>
                  </label>
                </>
              )}
            </section>
          </div>
          <aside className="admin-editor-side">
            <section className="admin-panel admin-form-section">
              <h2>Search & discovery</h2>
              {kind === 'blog' ? (
                <>
                  {field('seoTitle', 'Search title', {
                    max: 70,
                    help: `${draft.seoTitle?.length || 0}/70 characters`,
                  })}
                  {field('metaDescription', 'Meta description', {
                    area: true,
                    max: 170,
                    help: `${draft.metaDescription?.length || 0}/170 characters · Minimum 50`,
                  })}
                  <label>
                    Related service
                    <select
                      value={draft.service}
                      onChange={(e) => change('service', e.target.value)}
                    >
                      {services.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : (
                <fieldset>
                  <legend>Related services</legend>
                  {services.map((s) => (
                    <label className="admin-check" key={s.slug}>
                      <input
                        type="checkbox"
                        checked={draft.services?.includes(s.slug)}
                        onChange={(e) =>
                          change(
                            'services',
                            e.target.checked
                              ? [...draft.services!, s.slug]
                              : draft.services!.filter((v) => v !== s.slug),
                          )
                        }
                      />
                      {s.name}
                    </label>
                  ))}
                </fieldset>
              )}
              <div className="admin-search-preview">
                <small>SEARCH PREVIEW</small>
                <span>
                  /{kind}/{draft.slug || 'your-page-url'}
                </span>
                <strong>{draft.seoTitle || draft.title || 'Your page title'}</strong>
                <p>
                  {draft.metaDescription ||
                    draft.description ||
                    'Your search description will appear here.'}
                </p>
              </div>
              <p className="admin-help">
                Canonical URL, social preview image and sitemap inclusion are managed automatically.
                Drafts never appear publicly.
              </p>
            </section>
            <section className="admin-panel admin-form-section">
              <h2>Publishing</h2>
              <button className="admin-primary" disabled={busy}>
                {busy ? 'Saving…' : 'Save draft'}
              </button>
              {item && (
                <>
                  <button
                    type="button"
                    disabled={busy || dirty || item.status === 'archived'}
                    onClick={() => setConfirm('publish')}
                  >
                    Publish saved draft
                  </button>
                  {item.status === 'archived' ? (
                    <button
                      type="button"
                      disabled={busy || dirty}
                      onClick={() => setConfirm('restore')}
                    >
                      Restore as draft
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busy || dirty}
                      onClick={() => setConfirm('archive')}
                    >
                      Archive content
                    </button>
                  )}
                  {item.status === 'published' && (
                    <a href={`/${kind}/${item.slug}`} target="_blank" rel="noopener noreferrer">
                      View live page ↗
                    </a>
                  )}
                </>
              )}
              <small>
                Save changes before publishing. Archiving is reversible; there is no
                permanent-delete action.
              </small>
            </section>
          </aside>
        </form>
      )}
    </>
  );
}
