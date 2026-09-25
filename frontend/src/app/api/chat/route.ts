import { NextRequest, NextResponse } from 'next/server';
import { isIP } from 'node:net';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const api = process.env.API_BASE_URL;
  const secret = process.env.API_PROXY_SECRET;

  if (!api || !secret) {
    return NextResponse.json({ ok: true, messages: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const sessionId = request.nextUrl.searchParams.get('sessionId') || '';
  if (!sessionId) {
    return NextResponse.json({ ok: true, messages: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const upstreamUrl = new URL('/api/chat/history', api);
    upstreamUrl.searchParams.set('sessionId', sessionId);

    const upstream = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-proxy-secret': secret,
      },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
    });

    const data = await upstream.json();
    return NextResponse.json(data, {
      status: upstream.status,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ ok: true, messages: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(request: NextRequest) {
  const respond = (message: string, status: number) =>
    NextResponse.json({ ok: false, message }, { status, headers: { 'Cache-Control': 'no-store' } });

  const expectedOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').origin;
  const requestOrigin = request.headers.get('origin');

  // Verify origin in browser requests (allow if matches expected origin)
  if (requestOrigin && requestOrigin !== expectedOrigin) {
    return respond('This request is not allowed.', 403);
  }

  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return respond('Please send a JSON request.', 415);
  }

  const api = process.env.API_BASE_URL;
  const secret = process.env.API_PROXY_SECRET;

  if (!api || !secret) {
    return respond('The assistant is currently being configured. Please contact techiegrowera@gmail.com.', 503);
  }

  if (process.env.NODE_ENV === 'production' && !api.startsWith('https://')) {
    return respond('The assistant is temporarily unavailable.', 503);
  }

  try {
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
        return respond('Request payload is too large.', 413);
      }
      chunks.push(value);
    }

    const body = Buffer.concat(chunks).toString('utf8');
    try {
      JSON.parse(body);
    } catch {
      return respond('Invalid JSON request.', 400);
    }

    const ip =
      process.env.VERCEL === '1'
        ? (request.headers.get('x-vercel-forwarded-for') || '').split(',')[0].trim()
        : '127.0.0.1';

    if (!isIP(ip)) {
      return respond('Unable to validate this request.', 400);
    }

    const upstream = await fetch(new URL('/api/chat', api), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-proxy-secret': secret,
        'x-client-ip': ip,
      },
      body,
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(30000), // 30s timeout for LLM generation
    });

    const data = await upstream.json();
    const headers: Record<string, string> = { 'Cache-Control': 'no-store' };
    const retry = upstream.headers.get('Retry-After');
    if (retry) headers['Retry-After'] = retry;

    return NextResponse.json(data, { status: upstream.status, headers });
  } catch (error) {
    console.error('[ChatProxy] Upstream error:', error instanceof Error ? error.message : error);
    return respond(
      "Sorry, I'm having trouble responding right now. Please try again in a moment or contact our team directly at techiegrowera@gmail.com.",
      503
    );
  }
}
