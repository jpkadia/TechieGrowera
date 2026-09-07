# Architecture

Next.js App Router serves static service/business pages and server-rendered MongoDB articles/case studies when CMS_ENABLED=true. Public pages use the (site) route group; the authenticated admin has a separate layout without public analytics. Browsers call same-origin Next.js proxies; secrets stay on the server. Express authorizes admin operations and stores separate draft/published snapshots, sessions, audit logs and enquiries in MongoDB. Mutation/audit transactions and revision checks protect consistency. MongoDB-backed rate limits survive cold starts. See [Admin operations](ADMIN.md) for configuration, security boundaries and publishing behavior.

Deploy frontend and backend as separate Vercel projects, each with its corresponding root directory. No external deployment or GitHub operation is part of the initial local build. Real credentials, verified business information and reviewed legal copy are launch prerequisites. Demo case studies are explicitly labelled and noindexed.

Visual direction: editorial white space, deep navy typography, teal accents drawn from the supplied identity, fine grid lines, and an oversized brand monogram. No invented metrics, clients or testimonials.
