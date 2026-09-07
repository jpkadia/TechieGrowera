import { redirect } from 'next/navigation';
import { adminSession } from '@/lib/admin-server';
import { AdminShell } from '@/components/admin/shell';
export default async function Protected({ children }: { children: React.ReactNode }) {
  const session = await adminSession();
  if (!session) redirect('/admin/login');
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
