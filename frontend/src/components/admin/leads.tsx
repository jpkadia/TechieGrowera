'use client';
import { useState } from 'react';
import { adminApi, useAdminData, date } from './api';
import { AdminHeading, Notice, Pager } from './shared';
type Lead = {
  _id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  description: string;
  status: string;
  createdAt: string;
  consent: boolean;
};
export function Leads() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const { data, error, reload } = useAdminData<{ items: Lead[]; total: number }>(
    `leads?page=${page}&status=${filter}`,
  );
  async function update(status: string) {
    if (!selected) return;
    setBusy(true);
    try {
      await adminApi(`leads/${selected._id}`, 'PATCH', { status, previousStatus: selected.status });
      setSelected({ ...selected, status });
      setMessage('Enquiry status updated.');
      reload();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <AdminHeading
        eyebrow="CUSTOMER CONVERSATIONS"
        title="Enquiries"
        text="Review project briefs and keep track of your next conversation."
      />
      <div className="admin-toolbar">
        <label>
          Filter by status
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
              setSelected(null);
            }}
          >
            {['all', 'new', 'contacted', 'closed'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <button onClick={reload}>Refresh</button>
      </div>
      <Notice text={error} error />
      <Notice text={message} />
      <section className="admin-panel">
        {data ? (
          <>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Contact</th>
                    <th>Service</th>
                    <th>Received</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.name}</strong>
                        <small>{item.businessName || item.email}</small>
                      </td>
                      <td>{item.service.replaceAll('-', ' ')}</td>
                      <td>{date(item.createdAt)}</td>
                      <td>
                        <span className={`admin-badge ${item.status}`}>{item.status}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setSelected(item);
                            setMessage('');
                          }}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data.items.length && (
                <div className="admin-empty">No enquiries match this filter.</div>
              )}
            </div>
            <Pager page={page} total={data.total} size={20} onChange={setPage} />
          </>
        ) : (
          <p className="admin-loading">Loading enquiries…</p>
        )}
      </section>
      {selected && (
        <section className="admin-panel admin-lead-detail">
          <div className="admin-panel-heading">
            <h2>{selected.name}’s project</h2>
            <button onClick={() => setSelected(null)}>Close details</button>
          </div>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${selected.email}`}>{selected.email}</a>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{selected.phone || 'Not provided'}</dd>
            </div>
            <div>
              <dt>Budget range</dt>
              <dd>{selected.budget}</dd>
            </div>
            <div>
              <dt>Consent</dt>
              <dd>{selected.consent ? 'Provided' : 'Not recorded'}</dd>
            </div>
          </dl>
          <h3>Project description</h3>
          <p className="admin-preserve">{selected.description}</p>
          <label>
            Enquiry status
            <select
              disabled={busy}
              value={selected.status}
              onChange={(e) => update(e.target.value)}
            >
              {['new', 'contacted', 'closed'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </section>
      )}
    </>
  );
}
