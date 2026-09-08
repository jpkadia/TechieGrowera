# Homepage reliability fix

The backend is not only a contact API: it also serves published CMS articles/case studies and authenticated admin operations. Previously `Home()` awaited `getPosts()` and `getCaseStudies()` before returning any page content. Both call `readPublished()` in `frontend/src/lib/published-content.ts`, which fetches `/api/published/{kind}` with a 10-second timeout. Any connection error, timeout, invalid JSON or non-success response rejected `Promise.all` and could fail the homepage request. The audit observed initial homepage/sitemap HTTP 500 responses followed by successful responses. This proves the failure path, but provider logs are required to attribute a particular historical failure to cold start versus database/network/configuration errors.

## New homepage flow

The homepage is build-time static and declares `dynamic = 'error'` to catch accidental reintroduction of uncached server data. Layout, metadata, services, headings, FAQs, business schema and hub links require no Render request. No user-agent branching exists.

When CMS is enabled, only optional project/article cards fetch after browser hydration through `/api/highlights/{kind}`. These same-origin routes expose published records only, keep the proxy secret server-side, disable response caching and return a safe 503 on upstream failure. A preview failure displays a message in its section and cannot change the already served homepage status. Successful previews use the existing cards/design. The initial HTML contains links to the blog/portfolio hubs, not individual CMS cards. Full article/case pages remain server-rendered and CMS-backed.

When CMS is disabled, the pre-existing static reference cards render without fetching. It is not an outage fallback: never disable CMS to hide an outage after editorial publishing, because original reference content may have been archived.

Sitemap reads settle independently. Its existing static entries survive a failed CMS read; successfully fetched published entries still appear. Unavailable article/case entries are temporarily omitted and return after recovery. No archived seed content is substituted. The route remains dynamic. This is a partial sitemap during an outage, not a persistent last-known publication index.

## Other request paths

- `/contact` GET is static. `ContactForm.submit()` alone sends POST `/api/contact`; its mount effect only reads the selected service and sets form timing.
- Next.js contact POST validates origin/body, forwards to Render `/api/contact` with a 12-second timeout. Express rate-limit middleware connects to Atlas, validates and persists the enquiry before returning 201. The browser has a 20-second timeout, retains entered values on failure and resets only on confirmed success. No automatic POST retry is introduced; a timeout can mean delivery is uncertain.
- Blog, portfolio, case-study GETs and dynamic social image routes still fetch published CMS content. They genuinely depend on the backend and are outside the static-homepage guarantee.
- Protected admin layout validates its cookie via `/api/admin/session`; browser admin calls proxy through `/api/admin/[...path]`. These are not public homepage ancestors.
- Header/footer client components and consent analytics do not perform Render SSR reads. Next.js link prefetch can initiate optional route requests after hydration; it cannot block the static homepage response.
- There are no homepage server actions, middleware, custom rewrites or custom redirects forwarding the homepage to Render. Service `generateStaticParams()` reads the local service list. Homepage metadata is local and has no `generateMetadata()` fetch.

## Validation and rollout

Build with CMS_ENABLED=true and an unreachable API_BASE_URL to verify the homepage can be generated offline. `scripts/audit-reliability.ts` runs a built Next.js production server against an isolated mock CMS and covers healthy, 500, invalid JSON, timeout, disconnect and empty/archived publication states. It compares human and Googlebot homepage HTML and asserts zero backend calls for those GETs. It also runs the full public-site HTTP audit. Backend tests use temporary MongoDB only, including actual enquiry persistence and proxy failure handling; no real enquiries are submitted by these tests.

Production must receive a new frontend deployment before this fix affects the live URL. No new environment variables are required. Keep CMS_ENABLED=true, the existing canonical/indexability settings and Google verification. After deploying, inspect the homepage using Search Console's live test and request indexing after a successful fetch. This fixes the traced homepage dependency, not every possible Vercel infrastructure failure or search ranking.

Validated locally on 8 September 2026: lint and production build passed; the build used an unreachable CMS and reported a static homepage. All 21 isolated backend tests passed. Homepage GETs made zero backend calls and returned identical human/Googlebot HTML across healthy, server-error, malformed-response, timeout and disconnect modes. Highlight/sitemap tests also covered an empty published collection. The full HTTP audit passed 21 public pages, 30 internal links and 22 image URLs, plus metadata, structured data, query canonicals, redirects, 404s, robots and sitemap. Production deployment verification remains a rollout step.
