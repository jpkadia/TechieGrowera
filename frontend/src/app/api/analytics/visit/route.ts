import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const api = process.env.API_BASE_URL;
  const secret = process.env.API_PROXY_SECRET;

  if (!api || !secret) {
    return NextResponse.json({ ok: false, message: 'Analytics not configured' }, { status: 503 });
  }

  try {
    const body = await request.text();
    const ip =
      process.env.VERCEL === '1'
        ? (request.headers.get('x-vercel-forwarded-for') || '').split(',')[0].trim()
        : '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';

    const upstream = await fetch(new URL('/api/analytics/visit', api), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-proxy-secret': secret,
        'x-client-ip': ip,
        'user-agent': userAgent,
      },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    const data = await upstream.json().catch(() => ({ ok: true }));
    return NextResponse.json(data, {
      status: upstream.status,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    // Return 200 so visitor experience is never affected
    return NextResponse.json({ ok: true });
  }
}
