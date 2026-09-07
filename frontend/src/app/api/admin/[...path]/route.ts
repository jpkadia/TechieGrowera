import { NextRequest, NextResponse } from 'next/server';
import { adminCookie } from '@/lib/admin-server';
import { isIP } from 'node:net';
export const runtime = 'nodejs';
async function proxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const route = path.join('/');
  const json = (message: string, status: number) =>
    NextResponse.json(
      { ok: false, message },
      { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } },
    );
  if (
    !/^(login|logout|session|sessions\/revoke|dashboard|logs|leads(?:\/[a-f0-9]{24})?|content\/(?:blog|case-studies)(?:\/[a-f0-9]{24}(?:\/(?:publish|archive|restore))?)?)$/.test(
      route,
    )
  )
    return json('Not found.', 404);
  if (request.method !== 'GET') {
    if (
      request.headers.get('origin') !==
        new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').origin ||
      request.headers.get('x-admin-request') !== '1'
    )
      return json('Request origin is not allowed.', 403);
    if (!request.headers.get('content-type')?.startsWith('application/json'))
      return json('JSON is required.', 415);
  }
  const base = process.env.API_BASE_URL;
  const secret = process.env.API_PROXY_SECRET;
  if (!base || !secret) return json('Admin service is not configured.', 503);
  if (process.env.VERCEL === '1' && !base.startsWith('https://'))
    return json('Secure API connection required.', 503);
  const token = request.cookies.get(adminCookie)?.value;
  if (route !== 'login' && !token) return json('Please sign in.', 401);
  try {
    let body: string | undefined;
    if (request.method !== 'GET') {
      const reader = request.body?.getReader();
      const chunks: Uint8Array[] = [];
      let size = 0;
      if (reader)
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > 256 * 1024) {
            await reader.cancel();
            return json('Content is too large.', 413);
          }
          chunks.push(value);
        }
      body = Buffer.concat(chunks).toString('utf8') || '{}';
      try {
        JSON.parse(body);
      } catch {
        return json('Invalid JSON.', 400);
      }
    }
    const ip =
      process.env.VERCEL === '1'
        ? (request.headers.get('x-vercel-forwarded-for') || '').split(',')[0].trim()
        : '127.0.0.1';
    if (!isIP(ip)) return json('Unable to validate request.', 400);
    const url = new URL(`/api/admin/${route}`, base);
    for (const key of ['page', 'status']) {
      const value = request.nextUrl.searchParams.get(key);
      if (value) url.searchParams.set(key, value);
    }
    const upstream = await fetch(url, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-proxy-secret': secret,
        'x-admin-session': token || '',
        'x-client-ip': ip,
      },
      body,
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(20000),
    });
    const data = await upstream.json();
    const sessionToken = data.token;
    delete data.token;
    const result = NextResponse.json(data, {
      status: upstream.status,
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
    });
    if (upstream.headers.get('retry-after'))
      result.headers.set('Retry-After', upstream.headers.get('retry-after')!);
    if (route === 'login' && upstream.ok && sessionToken)
      result.cookies.set(adminCookie, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 8 * 3600,
      });
    if ((['logout', 'sessions/revoke'].includes(route) && upstream.ok) || upstream.status === 401)
      result.cookies.set(adminCookie, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      });
    return result;
  } catch {
    return json('Admin service is temporarily unavailable. Please retry.', 503);
  }
}
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
