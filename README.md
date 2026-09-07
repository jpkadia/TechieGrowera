# Techie Growera

A responsive web, creative and digital growth agency website built with Next.js 16.3.4 (current stable npm version checked during setup), React 19, App Router, TypeScript, Tailwind CSS 4, Express 5 and Mongoose/MongoDB. Designed around the supplied navy/teal identity. No GitHub repository was created, no commits were pushed, and no deployment was performed.

## Structure

```text
frontend/
  public/brand/         Supplied logo plus a cropped SVG monogram
  public/fonts/         Self-hosted Manrope variable font and license
  src/app/              Public routes, metadata, SEO files, API proxy
  src/components/       Shared UI, navigation, cards, consent and form
  src/content/          Typed services, blog articles and case studies
  src/lib/              Site configuration and social image renderer
backend/
  src/config/           Validated environment and pooled database connection
  src/controllers/      Contact lead controller
  src/middleware/       Authentication, durable rate limiting, safe errors
  src/models/           ContactLead, BlogPost, CaseStudy and RateBucket
  src/routes/           REST endpoints
  src/utils/            Validation and normalization
  src/scripts/          Database index creation
  tests/                Isolated MongoDB integration tests
scripts/                HTTP and SEO audit
docs/                   Architecture, keyword map, content and launch guides
```

Confirmed business details are in frontend/src/content/business.ts: founders Parth Kadiya and Kush Kadia, both supplied phone numbers, techiegrowera@gmail.com and Instagram @techiegrowera. Environment variables can override public contacts. Root PNG, SVG and PDF originals are preserved. The monogram is a code-native crop of the supplied SVG; the original full logo remains available in `public/brand`. The font license is included.

## Pages and functionality

Home, About, Services, seven detailed service pages, Portfolio, Case Studies, two clearly labelled demo case study detail pages, Blog, three full articles, Contact, Privacy Policy, Terms and a custom 404. Public content is rendered on the server and statically generated. Service pages have unique problems, solutions, deliverables, processes, use cases, FAQs and related links. The form provides pending, success and failure states and supports service preselection.

## Prerequisites and local setup

Use Node.js 22 or later and npm. From the workspace root:

```powershell
npm install
Copy-Item frontend/.env.example frontend/.env.local
Copy-Item backend/.env.example backend/.env
npm run dev
```

Set your Atlas URI in `backend/.env` and replace both secrets. The same `API_PROXY_SECRET` must be set in the frontend and backend. Use a separate `RATE_LIMIT_SALT` on the backend. Generate values with a password manager or a cryptographically secure generator; do not commit them. The default frontend is `http://localhost:3000`; backend is `http://localhost:4000`. Without configuration the site still renders, and enquiries return an honest unavailable response instead of fake success.

```powershell
npm run dev -w frontend
npm run dev -w backend
npm run typecheck
npm run lint
npm test
npm run build
npm run start -w frontend
npm run start -w backend
node scripts/audit-site.mjs
```

`npm test` starts an isolated temporary MongoDB instance, validates actual writes and cleans it up. The first run may download an official MongoDB test binary. It does not touch Atlas or require production credentials. `audit-site.mjs` requires a running frontend and accepts `AUDIT_BASE_URL` and `AUDIT_CANONICAL_URL`; defaults point to local development. `test-results/` is ignored.

## Environment variables

Both apps have `.env.example` files. `NEXT_PUBLIC_*` values are public build-time configuration; rebuild after changing them.

| Variable | App | Purpose |
| --- | --- | --- |
| NEXT_PUBLIC_SITE_URL | Frontend | Exact site origin; localhost fallback is only for local work |
| NEXT_PUBLIC_SITE_INDEXABLE | Frontend | Set true only for the final HTTPS production domain; defaults false |
| NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION | Frontend | Optional Search Console HTML verification token |
| NEXT_PUBLIC_GA_ID | Frontend | Optional GA4 measurement ID; scripts require visitor consent |
| NEXT_PUBLIC_BUSINESS_EMAIL / PHONE | Frontend | Real public contact details |
| NEXT_PUBLIC_SERVICE_AREA / BUSINESS_ADDRESS | Frontend | Verified geographic business information |
| NEXT_PUBLIC_SOCIAL_LINKEDIN / SOCIAL_INSTAGRAM | Frontend | Real HTTPS social profile URLs |
| API_BASE_URL | Frontend server only | Express origin, HTTPS in production |
| API_PROXY_SECRET | Both, server only | Shared authentication for frontend-to-backend requests; minimum 32 random characters |
| MONGODB_URI | Backend only | Atlas connection URI including dedicated database name |
| RATE_LIMIT_SALT | Backend only | Independent secret for hashing rate-limit IP keys |
| FRONTEND_ORIGIN | Backend | Exact frontend origin for CORS |
| NODE_ENV / PORT | Backend | Runtime mode and local port; production validates mandatory settings |

The implementation uses Vercel's platform-provided client-IP header on Vercel. Outside Vercel, the local proxy deliberately uses loopback as the bucket key. Deploying to another provider requires a trusted client-IP integration for that platform. Do not forward untrusted user headers as client identity.

## API and database

- Frontend `POST /api/contact`: checks Origin, content type and a streamed 16 KB size bound, then sends a timed authenticated server-to-server request.
- Express `POST /api/contact`: proxy authentication, shared MongoDB rate limit, Zod validation, text normalization, honeypot and timing checks, then a real database insert. Returns 201 only after persistence; 401, 422, 429 and 503 have explicit failure meanings.
- Express `GET /api/health`: liveness only; it does not claim database readiness or reveal credentials.

ContactLead stores the enquiry, consent, privacy version and status with timestamps. BlogPost and CaseStudy provide unique slug indexes and editorial fields for future CMS work; current published articles and case studies come from typed static content. RateBucket uses HMAC-derived IP keys, atomic increments and a TTL index. The limit is five requests per visitor per 15-minute fixed window; an additional instance-local guard protects short bursts. It is baseline abuse protection, not a bot-proof guarantee. No lead-list or admin endpoints are public.

Create an Atlas database and an application user with the minimum required permissions for that database. Configure network access for the deployment environment, select appropriate regions and enable backups. Keep credentials server-only. Create indexes explicitly before launch:

```powershell
npm run db:indexes -w backend
```

Production disables automatic index building. The URI must specify the intended database. Use Atlas access controls and operational procedures for lead review, retention and deletion; there is no inbox/admin UI in this scope.

## SEO and performance

Each page has a unique title and description, self-referencing canonical, Open Graph/Twitter metadata and its own generated social image. Service, article and case detail metadata is generated from the matching content record. The sitemap includes only indexable canonical pages and accurate article modification dates; demo case studies are excluded. While `NEXT_PUBLIC_SITE_INDEXABLE=false`, the sitemap is empty and pages emit noindex. Crawling remains allowed so crawlers can read that directive. The production robots file references the sitemap and excludes APIs/non-public areas without blocking assets.

JSON-LD includes Organization, WebSite, Service, BreadcrumbList, FAQPage and BlogPosting. ProfessionalService is conditional on actual address, phone and service-area configuration. No ratings, reviews, prices or locations are invented. Validate the completed real business records before launch. FAQ markup does not imply eligibility for Google FAQ rich results.

Server Components and static generation keep content available without browser JavaScript. Hydration is limited to navigation, the contact form and consent. The locally hosted variable font uses next/font, images have dimensions, below-fold logos are lazy loaded, SVG avoids a large raster hero, and optional analytics loads after consent. Responsive styles include visible keyboard focus and reduced-motion support. Numerical Lighthouse/Core Web Vitals targets remain unclaimed until measured against the real deployment.

See [keyword mapping](docs/KEYWORD-MAP.md), [editorial workflow](docs/CONTENT-GUIDE.md) and [architecture](docs/ARCHITECTURE.md).

## Security

Helmet, exact configured CORS origin, same-origin form checks, shared-secret proxy authentication, server-side allowlisted validation, strict object handling, payload limits, bounded upstream requests, MongoDB-backed rate limits, IP hashing, safe public errors and no client database access. Backend logs omit request bodies and connection strings. Frontend headers include frame denial, MIME protection, referrer/permissions policy and a baseline CSP for frames, objects and base URI. The CSP is deliberately not described as a complete script-nonce policy. Vercel supplies HTTPS; inspect the final deployed response headers as a launch check.

## Vercel deployment (when you are ready)

The requested stack is preserved as native Next.js + Express; no Cloudflare/Vinext conversion was made. You can use Vercel CLI or the dashboard without adding anything to GitHub during this phase.

1. Create a Vercel project whose root directory is `backend`. Select the Express framework. `backend/src/app.ts` exports the Express application and does not call listen; `server.ts` is the local runner. Set production backend variables.
2. Create a second project with root directory `frontend`, framework Next.js, and build command `npm run build` within that root. Enable access to workspace files outside the root if Vercel requires it for the npm workspace lockfile. Dependencies install from the monorepo lockfile.
3. Set the frontend's API_BASE_URL to the deployed backend origin and match API_PROXY_SECRET. Use the frontend's final origin in NEXT_PUBLIC_SITE_URL and backend FRONTEND_ORIGIN. Use a per-preview origin for previews if testing their forms.
4. Run database index creation against the intended database, then deploy and verify the backend health endpoint and a controlled end-to-end enquiry.
5. In the frontend project's Domains settings, add the domain you own. Add the exact DNS records Vercel provides at your registrar. Choose one canonical hostname and redirect its alternate. Wait for domain verification and HTTPS.
6. After real content, policies and enquiry handling are ready, set NEXT_PUBLIC_SITE_INDEXABLE=true only in the Production environment and rebuild. Keep Preview false.
7. Run the [production checklist](docs/PRODUCTION-CHECKLIST.md). Production infrastructure, DNS and Atlas credentials cannot be proven by the local build.

References: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Express on Vercel](https://vercel.com/docs/frameworks/backend/express), [Vercel request headers](https://vercel.com/docs/headers/request-headers).

## Google Search Console

1. After the domain serves the final website, add a Domain property in Search Console for full hostname/protocol coverage, or a URL-prefix property for the exact canonical origin.
2. For a Domain property, add the DNS TXT record Google supplies and complete verification. For URL-prefix HTML-tag verification, set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the token, rebuild and verify.
3. Submit `sitemap.xml` from the canonical domain. Confirm it contains real URLs and can be fetched.
4. Use URL Inspection for the homepage and important service pages. Check live accessibility, rendered content, canonical selection and indexing eligibility; request indexing where appropriate.
5. Review Page indexing for excluded pages, errors and unexpected duplicates. Demo pages intentionally remain noindex.
6. Monitor Core Web Vitals after sufficient field data is available. Review the page-experience guidance and relevant HTTPS/CWV reports available in the current Search Console interface; reports and labels can change.
7. Review Performance queries, pages, impressions, clicks and CTR. Use this evidence and real customer questions to improve existing pages and plan genuinely useful articles.

Official guide: [Getting started with Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start).

## Still needed from the business

Domain and deployment access, Atlas configuration, actual city/service area, legal business identity and reviewed policies, optional founder biographies/photos, actual portfolio materials and approved testimonials. Founder names, email, both phone numbers and Instagram are already added. Optional Search Console and GA identifiers can be added later. Do not send secrets through public content or commit environment files.

After launch, publish first-hand useful content, keep service pages accurate, develop real case studies, earn relevant genuine links and review Search Console regularly. Technical SEO creates a strong foundation; it cannot guarantee a first-place ranking.

