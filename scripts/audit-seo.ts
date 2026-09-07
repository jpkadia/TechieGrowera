import assert from 'node:assert/strict';

async function main() {
  // This process-only example origin is never written into website configuration.
  process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
  process.env.NEXT_PUBLIC_SITE_INDEXABLE = 'true';
  const { default: sitemap } = await import('../frontend/src/app/sitemap');
  const { default: robots } = await import('../frontend/src/app/robots');
  const { pageMetadata } = await import('../frontend/src/lib/site');
  const urls = (await sitemap()).map((entry) => entry.url);
  assert.equal(urls.length, 18);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes('https://example.com/services/seo'));
  assert.ok(urls.includes('https://example.com/blog/website-redesign-seo-checklist'));
  assert.ok(urls.every((url) => !url.includes('/api/') && !url.includes('/case-studies')));
  assert.equal(robots().sitemap, 'https://example.com/sitemap.xml');
  const publicPage = pageMetadata('SEO', 'Description', '/services/seo');
  const demo = pageMetadata('Demo', 'Demo description', '/case-studies/demo', true);
  assert.deepEqual(publicPage.robots, { index: true, follow: true });
  assert.deepEqual(demo.robots, { index: false, follow: true });
  assert.equal(publicPage.alternates?.canonical, 'https://example.com/services/seo');
  console.log(
    'PASS: production indexing mode includes 18 canonical public URLs, excludes demos and APIs, and advertises the sitemap.',
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
