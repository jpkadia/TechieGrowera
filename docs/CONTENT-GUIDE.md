# Editorial and business content

Published content currently lives in typed files: `frontend/src/content/services.ts` and `frontend/src/content/editorial.ts`. Add a complete record with a unique slug, meaningful description, publication and modification dates, author, tags and substantive sections. Service and blog routes are statically generated. Related articles are drawn from other published records; the contextual service relationship is explicit. New records automatically join static route generation and (when indexing is enabled) the sitemap.

MongoDB BlogPost and CaseStudy schemas are included for a future authenticated editorial workflow. No admin UI or public write/read CMS endpoints were requested or exposed. Those models are not silently used as the current publication source. Before connecting a CMS, add an authenticated publishing workflow, draft isolation and cache revalidation. Never fetch essential article copy only in the browser.

Case studies are initially fictional concept projects, with demo labels, no invented results, noindex metadata and exclusion from the sitemap. To publish a real study, obtain client permission, replace fictional details with verified information, add evidence and results, set `demo: false`, the case-study index becomes indexable automatically when real work exists; rebuild. Original social preview images are generated for each route; the brand SVG is reused without external image dependencies.

Founder names, both phone numbers, email and Instagram supplied by the user are stored in frontend/src/content/business.ts and displayed on the site. Before launch, optionally add genuine founder biographies and headshots (with permission), confirm legal business identity and service area, and review legal text. Do not manufacture testimonials. Add an approved testimonial only when its exact wording and attribution are verified.

For local expansion, add a typed location record with city slug, actual service area, relevant work, unique local explanation and accurate contact details. Create `/locations/[city]` only when those facts justify a useful page. Include it in the sitemap and breadcrumbs then; there are deliberately no thin location pages now.

Legal pages are visibly marked pre-launch drafts. Confirm the operator, contact, retention schedule, provider regions and jurisdiction with the business before live data collection. The optional analytics consent control loads GA only after opt-in. Revoking consent reloads the page to stop future loading; it does not automatically erase historic analytics records or provider cookies.

