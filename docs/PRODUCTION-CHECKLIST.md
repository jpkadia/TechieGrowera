# Launch checklist

- [x] Add supplied founder names, email, both phone numbers and Instagram.
- [ ] Confirm legal business identity, actual service area and any fuller founder biographies.
- [ ] Review and approve privacy/terms. Set a data retention schedule and assign a privacy contact.
- [ ] Confirm ownership and permissions for all future client work and testimonials.
- [ ] Create an Atlas database user restricted to the app database; configure appropriate network access and backups.
- [ ] Set independent random proxy and rate-hash secrets, at least 32 characters each.
- [ ] Deploy the Express backend and the Next.js frontend to their Vercel root directories.
- [ ] Set the exact HTTPS frontend origin in both applications, and server-only API_BASE_URL on the frontend.
- [ ] Run database index creation against the launch database. Confirm TTL and unique slug indexes.
- [ ] Use the final domain as NEXT_PUBLIC_SITE_URL, set production-only NEXT_PUBLIC_SITE_INDEXABLE=true, and rebuild.
- [ ] Keep previews and drafts noindex. Demo case studies remain noindex even on production.
- [ ] Submit a genuine controlled test enquiry; confirm it appears once in Atlas, then handle it according to the retention policy.
- [ ] Test failure, validation and rate-limit responses against the deployed API.
- [ ] Confirm canonical domain, HTTPS, trailing-slash redirects, no accidental robots blocks and sitemap URLs.
- [ ] Inspect generated schema in Rich Results Test / Schema Markup Validator. FAQ markup is not a promise of Google FAQ rich results.
- [ ] Measure production Lighthouse and real-user Core Web Vitals. Do not claim numerical scores without measurement.
- [ ] Verify Search Console ownership, submit the sitemap and inspect key pages.
- [ ] Configure optional GA only when the privacy policy covers actual usage. Confirm opt-in and withdrawal.
- [ ] Monitor availability, errors, indexing and enquiry handling after launch.

Local tests do not validate Atlas credentials, production Vercel routing, DNS, real Google indexing, external account permissions or field Core Web Vitals. Those are launch checks against the actual services.

