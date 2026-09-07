import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
const base = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const canonicalBase = process.env.AUDIT_CANONICAL_URL || 'http://localhost:3000';
const services = [
  'web-development',
  'seo',
  'graphic-design',
  'video-editing',
  'social-media-management',
  'digital-marketing',
  'meta-ads',
];
const articles = [
  'website-redesign-seo-checklist',
  'building-a-useful-social-content-plan',
  'before-your-first-meta-ads-campaign',
];
const cases = ['studio-north-concept', 'daily-form-concept'];
const paths = [
  '/',
  '/about',
  '/services',
  '/portfolio',
  '/case-studies',
  '/blog',
  '/contact',
  '/privacy-policy',
  '/terms',
  ...services.map((s) => `/services/${s}`),
  ...articles.map((s) => `/blog/${s}`),
  ...cases.map((s) => `/case-studies/${s}`),
];
const titles = new Set();
const descriptions = new Set();
const links = new Set();
const images = new Set();
const report = [];
for (const path of paths) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title, `title ${path}`);
  assert.ok(!titles.has(title), `duplicate title ${path}`);
  titles.add(title);
  const description = html.match(/<meta name="description" content="([^"]+)"/s)?.[1];
  assert.ok(description, `description ${path}`);
  assert.ok(!descriptions.has(description), `duplicate description ${path}`);
  descriptions.add(description);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/s)?.[1];
  assert.equal(new URL(canonical).href, new URL(path, canonicalBase).href, `canonical ${path}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `H1 ${path}`);
  const schema = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
    (match) => JSON.parse(match[1]),
  );
  assert.ok(schema.length, `schema ${path}`);
  for (const match of html.matchAll(/href="(\/[^"#]*)"/g)) {
    const url = match[1].replaceAll('&amp;', '&');
    if (!url.startsWith('/_next/') && !url.includes('opengraph-image')) links.add(url);
  }
  for (const match of html.matchAll(
    /<meta (?:property="og:image"|name="twitter:image") content="([^"]+)"/g,
  )) {
    const image = new URL(match[1].replaceAll('&amp;', '&'));
    images.add(image.pathname + image.search);
  }
  for (const match of html.matchAll(/<img[^>]+src="(\/[^\"]+)"/g))
    images.add(match[1].replaceAll('&amp;', '&'));
  report.push({ path, status: response.status, title, canonical, schemaBlocks: schema.length });
}
for (const path of links) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, `broken link ${path}`);
}
for (const path of images) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, `broken image ${path}`);
  assert.ok(response.headers.get('content-type')?.startsWith('image/'), `image content ${path}`);
}
assert.equal((await fetch(base + '/missing-page-audit')).status, 404);
assert.equal((await fetch(base + '/services/missing-service')).status, 404);
assert.equal((await fetch(base + '/services/seo/', { redirect: 'manual' })).status, 308);
const queryHtml = await (await fetch(base + '/services/seo?utm_source=audit')).text();
assert.ok(queryHtml.includes(`rel="canonical" href="${canonicalBase}/services/seo"`));
const robots = await fetch(base + '/robots.txt');
assert.equal(robots.status, 200);
assert.ok((await robots.text()).includes('Disallow: /api/'));
const sitemap = await fetch(base + '/sitemap.xml');
assert.equal(sitemap.status, 200);
const sitemapXml = await sitemap.text();
assert.ok(!sitemapXml.includes('studio-north-concept'));
await mkdir('test-results', { recursive: true });
await writeFile(
  'test-results/site-audit.json',
  JSON.stringify(
    {
      pages: report,
      checkedLinks: links.size,
      checkedImages: images.size,
      sitemapXml,
      checkedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);
console.log(
  `PASS: ${paths.length} pages, ${links.size} internal links, ${images.size} image URLs; metadata, JSON-LD, canonical query handling, 404s, redirect, sitemap and robots.`,
);
