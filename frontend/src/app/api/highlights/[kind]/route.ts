import { getPosts, getCaseStudies } from '@/lib/published-content';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };

export async function GET(_request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (kind !== 'blog' && kind !== 'case-studies')
    return Response.json({ ok: false }, { status: 404, headers });
  try {
    // Published-only data; never read drafts or fall back to archived seed records.
    const items =
      kind === 'blog' ? (await getPosts()).slice(0, 3) : (await getCaseStudies()).slice(0, 2);
    return Response.json({ ok: true, items }, { headers });
  } catch {
    return Response.json(
      { ok: false, message: 'Previews are temporarily unavailable.' },
      { status: 503, headers },
    );
  }
}
