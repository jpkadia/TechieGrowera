import { NextRequest, NextResponse } from 'next/server';
import { isIP } from 'node:net';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  const respond = (message: string, status: number) =>
    NextResponse.json({ ok: false, message }, { status, headers: { 'Cache-Control': 'no-store' } });
  const expectedOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    .origin;
  if (request.headers.get('origin') !== expectedOrigin)
    return respond('This request is not allowed.', 403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))
    return respond('Please send a JSON request.', 415);
  const api = process.env.API_BASE_URL;
  const secret = process.env.API_PROXY_SECRET;
  if (!api || !secret)
    return respond('Enquiries are not available yet. Please try again later.', 503);
  if (process.env.NODE_ENV === 'production' && !api.startsWith('https://'))
    return respond('Enquiries are temporarily unavailable.', 503);
  try {
    // Bound streaming input too; Content-Length is not trusted.
    const reader = request.body?.getReader();
    if (!reader) return respond('The request is empty.', 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16 * 1024) {
        await reader.cancel();
        return respond('Request is too large.', 413);
      }
      chunks.push(value);
    }
    const body = Buffer.concat(chunks).toString('utf8');
    try {
      JSON.parse(body);
    } catch {
      return respond('Invalid JSON request.', 400);
    }
    // Vercel overwrites this platform header. Never trust arbitrary X-Forwarded-For.
    const ip =
      process.env.VERCEL === '1'
        ? (request.headers.get('x-vercel-forwarded-for') || '').split(',')[0].trim()
        : '127.0.0.1';
    if (!isIP(ip)) return respond('Unable to validate this request.', 400);
    const upstream = await fetch(new URL('/api/contact', api), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-proxy-secret': secret,
        'x-client-ip': ip,
      },
      body,
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(12000),
    });
    const data = await upstream.json();
    const headers: Record<string, string> = { 'Cache-Control': 'no-store' };
    const retry = upstream.headers.get('Retry-After');
    if (retry) headers['Retry-After'] = retry;
    return NextResponse.json(data, { status: upstream.status, headers });
  } catch {
    return respond('We could not confirm delivery. Please try again later.', 503);
  }
}
