'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Inbox, FileText, BriefcaseBusiness, ShieldCheck } from 'lucide-react';
import { useAdminData, date, adminApi } from './api';
import { AdminHeading, Notice, Pager } from './shared';
type Log = {
  _id: string;
  createdAt: string;
  actor: string;
  action: string;
  target: string;
  outcome: string;
  detail?: string;
};
function LogTable({ items }: { items: Log[] }) {
  return (
    <div className="admin-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Target / details</th>
            <th>By</th>
            <th>Time</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.action.replaceAll('_', ' ')}</td>
              <td>
                <span className="admin-mono">{item.target}</span>
                <small>{item.detail}</small>
              </td>
              <td>{item.actor}</td>
              <td>{date(item.createdAt)}</td>
              <td>
                <span
                  className={`admin-badge ${item.outcome === 'failure' ? 'closed' : 'published'}`}
                >
                  {item.outcome}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!items.length && <div className="admin-empty">No activity recorded yet.</div>}
    </div>
  );
}
export function Dashboard() {
  const { data, error } = useAdminData<{
    leads: number;
    newLeads: number;
    blog: number;
    cases: number;
    sessions: number;
    recent: Log[];
  }>('dashboard');
  return (
    <>
      <AdminHeading
        eyebrow="YOUR WORKSPACE"
        title="A clear view of what’s next."
        text="Follow up on enquiries. Keep your content useful and up to date."
      />
      <Notice text={error} error />
      {!data && !error ? (
        <p className="admin-loading">Loading your overview…</p>
      ) : (
        data && (
          <>
            <div className="admin-stats">
              {[
                [data.newLeads, 'New enquiries', '/admin/leads', Inbox],
                [data.blog, 'Published articles', '/admin/content/blog', FileText],
                [
                  data.cases,
                  'Published case studies',
                  '/admin/content/case-studies',
                  BriefcaseBusiness,
                ],
                [data.sessions, 'Active sessions', '/admin/logs', ShieldCheck],
              ].map(([count, label, href, Icon]) => {
                const Glyph = Icon as typeof Inbox;
                return (
                  <Link href={String(href)} key={String(label)}>
                    <div>
                      <Glyph size={22} />
                      <ArrowUpRight size={17} />
                    </div>
                    <strong>{String(count)}</strong>
                    <span>{String(label)}</span>
                  </Link>
                );
              })}
            </div>
            <div className="admin-overview-grid">
              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <h2>Keep things moving</h2>
                  <span>QUICK ACTIONS</span>
                </div>
                <Link className="admin-action" href="/admin/leads">
                  <div>
                    <h3>Respond to your enquiries</h3>
                    <p>{data.leads} total enquiries in your workspace.</p>
                  </div>
                  <ArrowUpRight />
                </Link>
                <Link className="admin-action" href="/admin/content/blog/new">
                  <div>
                    <h3>Start a useful article</h3>
                    <p>Save a draft, review it, then publish.</p>
                  </div>
                  <ArrowUpRight />
                </Link>
              </section>
              <section className="admin-panel admin-seo-note">
                <span className="admin-kicker">PUBLISH WITH CONFIDENCE</span>
                <h2>
                  Good content.
                  <br />A protected foundation.
                </h2>
                <p>
                  Drafts stay private. Published URLs stay consistent. Your public pages and sitemap
                  update from published content.
                </p>
                <Link href="/admin/content/blog">Manage your journal →</Link>
              </section>
            </div>
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <h2>Recent activity</h2>
                <Link href="/admin/logs">View full log →</Link>
              </div>
              <LogTable items={data.recent} />
            </section>
          </>
        )
      )}
    </>
  );
}
export function Logs() {
  const [page, setPage] = useState(1);
  const { data, error } = useAdminData<{ items: Log[]; total: number }>(`logs?page=${page}`);
  const [message, setMessage] = useState('');
  const [confirm, setConfirm] = useState(false);
  async function revoke() {
    try {
      await adminApi('sessions/revoke', 'POST', {});
      // Full navigation removes authenticated router state after revocation.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign('/admin/login');
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  return (
    <>
      <AdminHeading
        eyebrow="SECURITY & ACCOUNTABILITY"
        title="Activity log"
        text="Logins, enquiry access and editorial changes. Records are retained for 180 days."
      >
        <button onClick={() => setConfirm(true)}>Sign out all sessions</button>
      </AdminHeading>
      {confirm && (
        <div className="admin-confirm">
          <p>This signs you out on every device, including this one.</p>
          <button className="admin-primary" onClick={revoke}>
            Confirm sign out
          </button>
          <button onClick={() => setConfirm(false)}>Cancel</button>
        </div>
      )}
      <Notice text={error || message} error />
      <section className="admin-panel">
        {data ? (
          <>
            <LogTable items={data.items} />
            <Pager page={page} total={data.total} size={30} onChange={setPage} />
          </>
        ) : (
          <p className="admin-loading">Loading activity…</p>
        )}
      </section>
    </>
  );
}
