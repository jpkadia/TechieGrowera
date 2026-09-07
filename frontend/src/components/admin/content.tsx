'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAdminData, date } from './api';
import { AdminHeading, Notice, Pager } from './shared';
export type ContentItem = {
  _id: string;
  slug: string;
  status: string;
  revision: number;
  draft: Record<string, unknown>;
  published?: Record<string, unknown>;
  everPublished: boolean;
  updatedAt: string;
};
export function ContentList({ kind }: { kind: string }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const { data, error, reload } = useAdminData<{ items: ContentItem[]; total: number }>(
    `content/${kind}?page=${page}&status=${filter}`,
  );
  return (
    <>
      <AdminHeading
        eyebrow="EDITORIAL WORKSPACE"
        title={kind === 'blog' ? 'Journal' : 'Case studies'}
        text="Create, review and publish. Saved drafts stay separate from your live website."
      >
        <Link className="admin-primary" href={`/admin/content/${kind}/new`}>
          + Create {kind === 'blog' ? 'article' : 'case study'}
        </Link>
      </AdminHeading>
      <div className="admin-toolbar">
        <label>
          Publication status
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            {['all', 'draft', 'published', 'archived'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <button onClick={reload}>Refresh</button>
      </div>
      <Notice text={error} error />
      <section className="admin-panel">
        {data ? (
          <>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title / URL</th>
                    <th>Status</th>
                    <th>Revision</th>
                    <th>Last saved</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>{String(item.draft?.title || item.slug)}</strong>
                        <small>
                          /{kind}/{item.slug}
                        </small>
                      </td>
                      <td>
                        <span className={`admin-badge ${item.status}`}>{item.status}</span>
                      </td>
                      <td>{item.revision}</td>
                      <td>{date(item.updatedAt)}</td>
                      <td>
                        <Link href={`/admin/content/${kind}/${item._id}`}>Open editor →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data.items.length && (
                <div className="admin-empty">Nothing here yet. Start with a new draft.</div>
              )}
            </div>
            <Pager page={page} total={data.total} size={20} onChange={setPage} />
          </>
        ) : (
          <p className="admin-loading">Loading content…</p>
        )}
      </section>
    </>
  );
}
