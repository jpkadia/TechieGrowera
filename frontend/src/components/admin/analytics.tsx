'use client';

import { useState } from 'react';
import { useAdminData, date } from './api';
import { AdminHeading, Notice, Pager } from './shared';
import { Users, Eye, MessageSquare, Monitor, Smartphone, Tablet, RefreshCw } from 'lucide-react';
import Link from 'next/link';

type BreakdownItem = {
  name: string;
  count: number;
};

type AnalyticsData = {
  stats: {
    totalVisitors: number;
    totalPageViews: number;
    totalChats: number;
    osBreakdown: BreakdownItem[];
    browserBreakdown: BreakdownItem[];
    deviceBreakdown: BreakdownItem[];
  };
  recentVisitors: Array<{
    _id: string;
    visitorId: string;
    sessionId: string | null;
    ip: string;
    os: string;
    browser: string;
    device: string;
    pagesVisited: string[];
    pageCount: number;
    firstSeenAt: string;
    lastSeenAt: string;
  }>;
  total: number;
  page: number;
  pages: number;
};

export function AnalyticsDashboard() {
  const [page, setPage] = useState(1);
  const { data, error, reload, loading } = useAdminData<AnalyticsData>(`analytics?page=${page}`);

  return (
    <>
      <AdminHeading
        eyebrow="AUDIENCE INTELLIGENCE"
        title="Visitors & Traffic"
        text="Real-time website visitor activity, technology breakdown, and engagement tracking."
      >
        <button onClick={reload} className="button button-secondary flex items-center gap-1.5 cursor-pointer">
          <RefreshCw size={14} /> Refresh
        </button>
      </AdminHeading>

      <Notice text={error} error />

      {loading && !data && <p className="admin-empty">Loading analytics...</p>}

      {data && (
        <div className="space-y-6">
          {/* Top Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#d0e4e4] shadow-xs">
              <div className="flex items-center justify-between text-[#566773] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Visitors</span>
                <Users size={18} className="text-[#007e83]" />
              </div>
              <div className="text-2xl font-bold text-[#092d49]">{data.stats.totalVisitors}</div>
              <p className="text-xs text-[#566773] mt-1">Unique visitor sessions tracked</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#d0e4e4] shadow-xs">
              <div className="flex items-center justify-between text-[#566773] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Page Views</span>
                <Eye size={18} className="text-[#01bfc3]" />
              </div>
              <div className="text-2xl font-bold text-[#092d49]">{data.stats.totalPageViews}</div>
              <p className="text-xs text-[#566773] mt-1">
                {data.stats.totalVisitors > 0
                  ? `~${(data.stats.totalPageViews / data.stats.totalVisitors).toFixed(1)} views / visitor`
                  : '0 views / visitor'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#d0e4e4] shadow-xs">
              <div className="flex items-center justify-between text-[#566773] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Chat Conversations</span>
                <MessageSquare size={18} className="text-[#007e83]" />
              </div>
              <div className="text-2xl font-bold text-[#092d49]">{data.stats.totalChats}</div>
              <p className="text-xs text-[#566773] mt-1">
                <Link href="/admin/chats" className="text-[#007e83] hover:underline font-medium">
                  View all conversations →
                </Link>
              </p>
            </div>
          </div>

          {/* Technology & Device Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Operating Systems */}
            <div className="bg-white p-5 rounded-xl border border-[#d0e4e4] shadow-xs">
              <h3 className="text-sm font-semibold text-[#092d49] mb-4">Operating Systems</h3>
              <div className="space-y-3">
                {data.stats.osBreakdown.length === 0 && (
                  <p className="text-xs text-[#566773]">No OS data logged yet.</p>
                )}
                {data.stats.osBreakdown.map((item) => {
                  const pct = data.stats.totalVisitors > 0
                    ? Math.round((item.count / data.stats.totalVisitors) * 100)
                    : 0;
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs text-[#092d49]">
                        <span>{item.name}</span>
                        <span className="font-semibold">{item.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#f1f8f8] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#007e83] h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Browsers */}
            <div className="bg-white p-5 rounded-xl border border-[#d0e4e4] shadow-xs">
              <h3 className="text-sm font-semibold text-[#092d49] mb-4">Browsers</h3>
              <div className="space-y-3">
                {data.stats.browserBreakdown.length === 0 && (
                  <p className="text-xs text-[#566773]">No browser data logged yet.</p>
                )}
                {data.stats.browserBreakdown.map((item) => {
                  const pct = data.stats.totalVisitors > 0
                    ? Math.round((item.count / data.stats.totalVisitors) * 100)
                    : 0;
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs text-[#092d49]">
                        <span>{item.name}</span>
                        <span className="font-semibold">{item.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#f1f8f8] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#01bfc3] h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Device Categories */}
            <div className="bg-white p-5 rounded-xl border border-[#d0e4e4] shadow-xs">
              <h3 className="text-sm font-semibold text-[#092d49] mb-4">Device Types</h3>
              <div className="space-y-3">
                {data.stats.deviceBreakdown.length === 0 && (
                  <p className="text-xs text-[#566773]">No device data logged yet.</p>
                )}
                {data.stats.deviceBreakdown.map((item) => {
                  const pct = data.stats.totalVisitors > 0
                    ? Math.round((item.count / data.stats.totalVisitors) * 100)
                    : 0;
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-[#092d49]">
                        <span className="flex items-center gap-1.5">
                          {item.name === 'Mobile' ? <Smartphone size={14} /> : item.name === 'Tablet' ? <Tablet size={14} /> : <Monitor size={14} />}
                          {item.name}
                        </span>
                        <span className="font-semibold">{item.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#f1f8f8] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#092d49] h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Visitor Activity Log */}
          <div className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Recent Visitors & Journey</h2>
                <small className="text-[#617682] block text-[11px] mt-0.5">Tracking visitors active in the last 60 days</small>
              </div>
              <span className="admin-badge">{data.total || data.stats.totalVisitors} TOTAL VISITORS</span>
            </div>

            {data.recentVisitors.length === 0 ? (
              <p className="admin-empty">No visitor activity recorded in the last 60 days.</p>
            ) : (
              <>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Visitor / IP</th>
                        <th>Device & OS</th>
                        <th>Pages Visited</th>
                        <th>Chatted?</th>
                        <th>First Seen</th>
                        <th>Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentVisitors.map((v) => (
                        <tr key={v._id}>
                          <td>
                            <strong>{v.ip}</strong>
                            <small className="admin-mono text-[#617682]">{v.visitorId.slice(0, 10)}…</small>
                          </td>
                          <td>
                            <span className="admin-badge">{v.device}</span>
                            <small className="text-[#617682] block">{v.os} · {v.browser}</small>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', maxWidth: '340px' }}>
                              <span className="admin-badge" style={{ fontWeight: 700 }}>
                                {v.pageCount} {v.pageCount === 1 ? 'page' : 'pages'}
                              </span>
                              {v.pagesVisited.slice(0, 2).map((p, idx) => (
                                <span
                                  key={idx}
                                  className="admin-mono"
                                  style={{
                                    fontSize: '11px',
                                    padding: '2px 6px',
                                    background: '#f1f8f8',
                                    border: '1px solid #d8e9e7',
                                    borderRadius: '4px',
                                    color: '#092d49',
                                    maxWidth: '130px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                  title={p}
                                >
                                  {p}
                                </span>
                              ))}
                              {v.pagesVisited.length > 2 && (
                                <span
                                  style={{
                                    fontSize: '10.5px',
                                    padding: '2px 6px',
                                    background: '#eef2f5',
                                    color: '#5d7481',
                                    borderRadius: '4px',
                                    fontWeight: 650,
                                    cursor: 'default',
                                  }}
                                  title={v.pagesVisited.slice(2).join(', ')}
                                >
                                  +{v.pagesVisited.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            {v.sessionId ? (
                              <Link
                                href="/admin/chats"
                                className="admin-badge published"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                              >
                                <MessageSquare size={11} /> Yes
                              </Link>
                            ) : (
                              <span className="admin-badge">No</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap text-xs text-[#566773]">{date(v.firstSeenAt)}</td>
                          <td className="whitespace-nowrap text-xs text-[#092d49] font-medium">{date(v.lastSeenAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pager
                  page={page}
                  total={data.total || data.stats.totalVisitors}
                  size={10}
                  onChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
