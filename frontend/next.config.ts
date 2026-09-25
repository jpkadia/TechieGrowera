import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: '/blog/before-your-first-meta-ads-campaign',
        destination: '/blog/meta-ads-campaign',
        permanent: true,
      },
      {
        source: '/blog/building-a-useful-social-content-plan',
        destination: '/blog/social-content-plan',
        permanent: true,
      },
      {
        source: '/blog/website-redesign-seo-checklist',
        destination: '/blog/website-redesign-seo',
        permanent: true,
      },
      {
        source: '/case-studies',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/case-studies/:slug',
        destination: '/portfolio/:slug',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }, { key: 'Cache-Control', value: 'no-store' }] },
      { source: '/api/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }, { key: 'Cache-Control', value: 'no-store' }] },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
          },
        ],
      },
    ];
  },
};
export default config;
