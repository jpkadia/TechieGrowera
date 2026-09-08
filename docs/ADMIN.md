# Admin panel

Run `npm run dev` from the project root, then open http://localhost:3000/admin/login. The supplied administrator credentials are configured in the ignored `backend/.env`; no password is included in source code or this guide.

## Daily use

- Overview shows enquiry and publication counts with recent activity.
- Enquiries provides pagination, status filtering and status updates.
- Journal and Case studies support create, save draft, private preview, publish, archive and restore. Save changes before publishing. Saving an edit does not change the published version until you publish again.
- Published slugs are locked to preserve existing URLs. Archive removes the public page and sitemap entry; restore returns it to a private draft. URL changes requiring redirects should be reviewed in code.
- Activity logs records authentication, enquiry access/status changes, publishing actions and session revocation. Revoke all sessions signs out every session, including yours.

Editors accept structured plain text, SEO titles/descriptions and existing local image paths. They do not accept arbitrary HTML or provide media uploads. Case studies retain explicit demo labels and noindex until marked as verified real work. Services, business details and shared design remain in the typed frontend content files.

## Configuration and deployment

Backend variables: `ADMIN_EMAIL`, `ADMIN_PASSWORD` (minimum 12 characters), and independent random `ADMIN_SESSION_SECRET` (minimum 32 characters). Restart the backend after changing these; existing sessions then become invalid. Keep environment files out of Git. This is one environment-configured administrator; multi-user roles, MFA and email password reset are not implemented.

Frontend `CMS_ENABLED=true` reads published MongoDB content on the server. The current local database has already received the original three articles and two demo case studies. Do not switch CMS off after publishing: false uses the original static reference content.

For a new deployment, configure the backend and Atlas first, create indexes, migrate initial content if needed, then enable CMS on the frontend:

```powershell
npm run db:indexes -w backend
node node_modules/tsx/dist/cli.mjs scripts/seed-editorial.ts
```

The migration reads `backend/.env` and inserts missing original records without overwriting existing records. MongoDB transactions require a replica set, which Atlas provides. Configure the matching proxy secret, frontend/backend origins and HTTPS before production use. Keep indexing disabled until the final domain is ready.

## Security and SEO behavior

Authorization is enforced by the backend on every admin operation. Opaque sessions are stored hashed in MongoDB, with HttpOnly/SameSite Strict cookies (Secure in production), eight-hour absolute expiry and thirty-minute idle expiry. Login uses scrypt/constant-time comparisons and a durable five-attempts-per-fifteen-minute IP bucket. Mutations require same-origin requests. Payload validation, pagination and revision checks prevent malformed writes and silent concurrent overwrites.

Audit events and content/status mutations commit together. Logs omit passwords, tokens and enquiry bodies; IPs are hashed. Logs expire after 180 days and session expiry is indexed; MongoDB TTL cleanup is asynchronous. There is no log-edit/delete action in the panel. These application logs are not an external tamper-proof audit service.

Admin pages and APIs carry noindex/no-store headers and never enter the sitemap. Public articles, case studies, metadata and structured data remain server-rendered. CMS reads are uncached across requests so publishing and archiving take effect on subsequent requests; backend availability is therefore required for these pages. Drafts never enter published API responses. Existing public URLs and social image paths are preserved. These controls protect technical SEO, but cannot guarantee rankings.

## Verification

The homepage now serves static core HTML; optional CMS cards load after hydration. Sitemap generation preserves its static URL entries during CMS outages. Full editorial pages still require the backend. See [Homepage reliability](HOMEPAGE-RELIABILITY.md) for the request flow, outage behavior and regression procedure.

`npm run lint`, `npm test` and `npm run build` cover static checks, twenty isolated MongoDB integration tests and production compilation. `node scripts/audit-site.mjs` checks a running site's pages, links, images and metadata. `node scripts/audit-admin.mjs` checks local login/session/CSRF/noindex behavior using configured credentials; it creates login/logout audit events but no business content. It accepts only localhost targets.

Security references: [OWASP session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
