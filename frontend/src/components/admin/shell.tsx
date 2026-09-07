'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState,useEffect } from 'react';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  BriefcaseBusiness,
  History,
  LogOut,
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react';
import { adminApi } from './api';
const links = [
  ['/admin', 'Overview', LayoutDashboard],
  ['/admin/leads', 'Enquiries', Inbox],
  ['/admin/content/blog', 'Journal', FileText],
  ['/admin/content/case-studies', 'Case studies', BriefcaseBusiness],
  ['/admin/logs', 'Activity log', History],
] as const;
export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false);};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);},[]);
  async function logout() {
    try {
      await adminApi('logout', 'POST', {});
      // Full navigation removes authenticated router state after sign-out.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign('/admin/login');
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <div className="admin-workspace">
      <aside id="admin-sidebar" className={`admin-sidebar ${open ? 'open' : ''}`}>
        <Link href="/admin" className="admin-wordmark">
          Techie <strong>Growera</strong>
          <small>ADMIN WORKSPACE</small>
        </Link>
        <span className="admin-nav-label">WORKSPACE</span>
        <nav aria-label="Admin navigation">
          {links.map(([href, label, Icon]) => (
            <Link
              href={href}
              key={href}
              aria-current={
                path === href || (href !== '/admin' && path.startsWith(href + '/'))
                  ? 'page'
                  : undefined
              }
              onClick={() => setOpen(false)}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            View website <ArrowUpRight size={16} />
          </Link>
          <span>{email}</span>
          <button onClick={logout}>
            <LogOut size={17} />
            Sign out
          </button>
          {error && <p role="alert">{error}</p>}
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu"
            aria-label={open ? 'Close admin navigation' : 'Open admin navigation'}
            aria-expanded={open}
            aria-controls="admin-sidebar"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <span>
            Techie Growera <span className="admin-top-divider">/</span> Administration
          </span>
          <span className="admin-private">
            <LockIcon />
            Private workspace
          </span>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
function LockIcon() {
  return <span className="admin-status-dot" aria-hidden="true" />;
}
