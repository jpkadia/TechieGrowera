import 'server-only';
import { cookies } from 'next/headers';
export const adminCookie = process.env.NODE_ENV === 'production' ? '__Host-tg-admin' : 'tg-admin';
export async function adminSession() {
  const token = (await cookies()).get(adminCookie)?.value;
  if (!token) return null;
  const base = process.env.API_BASE_URL;
  const secret = process.env.API_PROXY_SECRET;
  if (!base || !secret) throw new Error('Admin service is not configured.');
  const response = await fetch(new URL('/api/admin/session', base), {
    headers: { 'x-api-proxy-secret': secret, 'x-admin-session': token },
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error('Admin service is temporarily unavailable.');
  return response.json() as Promise<{ email: string }>;
}
