import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const api = process.env.API_BASE_URL;
  if (!api) {
    return NextResponse.json(
      { ok: true, skipped: true, message: 'Backend URL not configured.' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const warmupUrl = new URL('/api/health?warm=true', api);
    const response = await fetch(warmupUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(60000), // Patient 60s timeout for Render cold starts
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(
      { ok: response.ok, warmed: true, data },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    // Return graceful status even if warmup timed out so client is never broken
    return NextResponse.json(
      { ok: false, warmed: false, error: (err as Error).message },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
