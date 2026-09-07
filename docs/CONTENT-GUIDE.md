# Editorial and business content

With CMS_ENABLED=true, use the admin Journal and Case studies editors for published editorial content. Save a complete draft, review its private preview, then publish. Services remain in `frontend/src/content/services.ts`; `editorial.ts` is the migration/reference source. Public editorial pages and metadata render on the server, with published records automatically joining the sitemap when eligible.

MongoDB stores draft and published snapshots separately. Saving edits preserves the live version until publishing. See [Admin guide](ADMIN.md) for archive/restore behavior, locked published URLs and deployment instructions. Never fetch essential article copy only in the browser.

Case studies are initially fictional concept projects, with demo labels, no invented results, noindex metadata and exclusion from the sitemap. To publish a real study, obtain client permission, replace fictional details with verified information, add evidence and results, set `demo: false`, the case-study index becomes indexable automatically when real work exists and is published. Original social preview images are generated for each route; the brand SVG is reused without external image dependencies.

Founder names, both phone numbers, email and Instagram supplied by the user are stored in frontend/src/content/business.ts and displayed on the site. Before launch, optionally add genuine founder biographies and headshots (with permission), confirm legal business identity and service area, and review legal text. Do not manufacture testimonials. Add an approved testimonial only when its exact wording and attribution are verified.

For local expansion, add a typed location record with city slug, actual service area, relevant work, unique local explanation and accurate contact details. Create `/locations/[city]` only when those facts justify a useful page. Include it in the sitemap and breadcrumbs then; there are deliberately no thin location pages now.

Legal pages are visibly marked pre-launch drafts. Confirm the operator, contact, retention schedule, provider regions and jurisdiction with the business before live data collection. The optional analytics consent control loads GA only after opt-in. Revoking consent reloads the page to stop future loading; it does not automatically erase historic analytics records or provider cookies.

