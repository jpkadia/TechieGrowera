# Validation record — 7 September 2026

| Check | Result |
| --- | --- |
| Full `npm run check` | Passed: both TypeScript projects, ESLint, nine integration tests and production build |
| Express/MongoDB integration | Passed against an isolated temporary MongoDB, including a real saved document |
| Next.js → Express → MongoDB | Passed: same-origin request, proxy authentication and persistence |
| Invalid input and operator injection | Rejected without an insert |
| Honeypot, timing and rate limit | Rejected as expected; sixth per-IP request gets 429 |
| Production HTTP audit | 21 content pages, 30 internal targets, 22 image URLs passed |
| Metadata | Unique titles/descriptions, canonical URLs, one H1 per content page and parseable JSON-LD |
| Routing | Unknown page/service 404; trailing slash 308; query parameters do not change canonical |
| Crawl files | robots.txt and sitemap.xml respond correctly; previews noindex |
| Production indexing configuration | 18 canonical public pages; demos/APIs excluded; sitemap advertised |
| Browser | Desktop homepage, mobile menu/Escape, service preselection and failure feedback checked |
| Responsive | Contact at 320/390/768/1440px; homepage at desktop and narrow-phone sizes |
| Dependencies | npm installation audit reported zero vulnerabilities |

The frontend is intentionally left without live Atlas credentials. The contact form shows an unavailable message rather than falsely claiming delivery. Direct email, phone and Instagram links use the supplied business details. Successful persistence was verified independently through both API layers against temporary MongoDB.

Not performed: public deployment, Atlas credential/network validation, DNS setup, Google ownership verification, live Google indexing, official rich-results validation with final business data, numerical Lighthouse scoring, field Core Web Vitals, or testing on physical Android/iOS devices. Responsive checks use browser viewport sizes. No GitHub action was taken.
