import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { posts, caseStudies } from '../frontend/src/content/editorial';

// Isolated HTTP fixtures only. Never reads Atlas or submits a real enquiry.
async function main() {
  let mode = 'healthy';
  let calls = 0;
  const backend = createServer((req, res) => {
    calls++;
    if (mode === 'timeout') return;
    if (mode === 'disconnect') return req.socket.destroy();
    res.setHeader('content-type', 'application/json');
    if (mode === 'error') {
      res.writeHead(500);
      res.end('{"ok":false}');
      return;
    }
    if (mode === 'malformed') {
      res.end('not-json');
      return;
    }
    const items = mode === 'empty' ? [] : req.url === '/api/published/blog' ? posts : caseStudies;
    res.end(JSON.stringify({ ok: true, items }));
  });
  backend.listen(0, '127.0.0.1');
  await once(backend, 'listening');
  const apiPort = (backend.address() as { port: number }).port;
  const port = 3107;
  const origin = `http://localhost:${port}`;
  const web = spawn(
    process.execPath,
    ['../node_modules/next/dist/bin/next', 'start', '-p', String(port)],
    {
      cwd: 'frontend',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        CMS_ENABLED: 'true',
        API_BASE_URL: `http://127.0.0.1:${apiPort}`,
        API_PROXY_SECRET: 'isolated-reliability-test-secret-1234567890',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  let output = '';
  web.stdout.on('data', (chunk) => {
    output += chunk;
  });
  web.stderr.on('data', (chunk) => {
    output += chunk;
  });
  async function get(path: string, ua?: string) {
    return fetch(origin + path, {
      headers: ua ? { 'User-Agent': ua } : {},
      signal: AbortSignal.timeout(25000),
    });
  }
  try {
    for (let attempt = 0; attempt < 80 && !output.includes('Ready'); attempt++) {
      if (web.exitCode !== null) throw new Error('Test web server exited before ready');
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    assert.ok(output.includes('Ready'), 'production server ready');
    for (const state of ['healthy', 'error', 'malformed', 'timeout', 'disconnect']) {
      mode = state;
      calls = 0;
      const started = Date.now();
      const normal = await get('/');
      const html = await normal.text();
      const bot = await get(
        '/',
        'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      );
      assert.equal(normal.status, 200, state);
      assert.equal(bot.status, 200, state);
      assert.equal(await bot.text(), html, 'same homepage HTML for humans and Googlebot');
      assert.equal(calls, 0, 'homepage must make zero backend requests');
      assert.ok(Date.now() - started < 5000, 'homepage must not wait for CMS timeout');
      assert.match(html, /Techie Growera/);
      const title = html.match(/<title>(.*?)<\/title>/)?.[1] || '';
      assert.equal(
        title.split('Techie Growera').length - 1,
        1,
        'brand appears once in homepage title',
      );
      assert.match(html, /name="google-site-verification"/);
      assert.match(html, /rel="canonical" href="https:\/\/techiegrowera.vercel.app/);
      assert.match(html, /name="robots" content="index, follow"/);
      assert.match(html, /application\/ld\+json/);
      console.log(`PASS homepage ${state}: 200, identical Googlebot HTML, zero backend calls`);
    }
    for (const state of ['healthy', 'error', 'malformed', 'timeout', 'disconnect', 'empty']) {
      mode = state;
      const [highlight, sitemap] = await Promise.all([
        get('/api/highlights/blog'),
        get('/sitemap.xml'),
      ]);
      const xml = await sitemap.text();
      assert.equal(sitemap.status, 200, `sitemap ${state}`);
      assert.match(xml, /https:\/\/techiegrowera.vercel.app\/services\/seo/);
      assert.doesNotMatch(xml, /studio-north-concept|daily-form-concept|\/admin/);
      assert.equal(highlight.headers.get('cache-control'), 'no-store');
      const data = await highlight.json();
      if (state === 'healthy') {
        assert.equal(highlight.status, 200);
        assert.equal(data.items.length, 3);
        assert.match(xml, /website-redesign-seo-checklist/);
      } else if (state === 'empty') {
        assert.deepEqual(data.items, []);
        assert.doesNotMatch(xml, /website-redesign-seo-checklist/);
      } else {
        assert.equal(highlight.status, 503);
        assert.equal(data.ok, false);
        assert.doesNotMatch(xml, /website-redesign-seo-checklist/);
      }
      console.log(`PASS highlights + sitemap: ${state}`);
    }
    assert.equal((await get('/api/highlights/admin')).status, 404);
    mode = 'healthy';
    for (const path of [
      '/about',
      '/services',
      '/services/seo',
      '/contact',
      '/blog',
      '/portfolio',
      '/case-studies',
      '/privacy-policy',
      '/terms',
      ...posts.map((p) => `/blog/${p.slug}`),
      ...caseStudies.map((s) => `/case-studies/${s.slug}`),
      '/robots.txt',
      '/opengraph-image',
    ]) {
      assert.equal((await get(path)).status, 200, path);
    }
    assert.equal((await get('/blog/nonexistent-audit')).status, 404);
    const filteredBlog = await get('/blog?service=web-development');
    assert.equal(filteredBlog.status, 200);
    const filteredHtml = await filteredBlog.text();
    assert.match(filteredHtml, /Guides related to/);
    assert.match(filteredHtml, /rel="canonical" href="https:\/\/techiegrowera.vercel.app\/blog"/);
    console.log('PASS existing pages, robots, social image, unknown content 404');
    const audit = spawn(process.execPath, ['scripts/audit-site.mjs'], {
      env: {
        ...process.env,
        AUDIT_BASE_URL: origin,
        AUDIT_CANONICAL_URL: 'https://techiegrowera.vercel.app',
      },
      stdio: 'inherit',
    });
    const [auditExit] = await once(audit, 'exit');
    assert.equal(auditExit, 0, 'complete public-site regression audit');
  } finally {
    web.kill();
    backend.closeAllConnections();
    await new Promise<void>((resolve) => backend.close(() => resolve()));
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
