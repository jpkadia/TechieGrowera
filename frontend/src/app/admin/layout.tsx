import type { Metadata } from 'next';
import './admin.css';
export const metadata: Metadata = {
  title: { default: 'Administration', template: '%s | Techie Growera Admin' },
  robots: { index: false, follow: false, noarchive: true },
  referrer: 'same-origin',
};
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
