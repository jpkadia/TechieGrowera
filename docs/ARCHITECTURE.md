# Architecture

Next.js App Router serves statically generated public pages and content from typed, versioned editorial files. Only navigation, consent and the enquiry form hydrate on the client. The frontend POST route proxies to a separate Express application; browsers never receive the database URI or proxy secret. Express validates enquiries and writes to MongoDB. MongoDB-backed rate-limit buckets survive serverless cold starts. Blog and case study Mongoose models provide an optional future CMS storage layer; the current source of published content is frontend/src/content.

Deploy frontend and backend as separate Vercel projects, each with its corresponding root directory. No external deployment or GitHub operation is part of the initial local build. Real credentials, verified business information and reviewed legal copy are launch prerequisites. Demo case studies are explicitly labelled and noindexed.

Visual direction: editorial white space, deep navy typography, teal accents drawn from the supplied identity, fine grid lines, and an oversized brand monogram. No invented metrics, clients or testimonials.
