export type ContentSection = { heading: string; paragraphs: string[] };
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage: string;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string;
  metaDescription: string;
  canonicalPath: string;
  ogImage: string;
  service: string;
  sections: ContentSection[];
};
export const posts: BlogPost[] = [
  {
    slug: 'website-redesign-seo-checklist',
    title: 'Planning a website redesign? Protect the foundations first.',
    excerpt:
      'A practical checklist for preserving useful pages, improving the customer journey and preparing for a cleaner launch.',
    author: 'Techie Growera Editorial',
    category: 'Web & SEO',
    tags: ['Website redesign', 'Technical SEO'],
    featuredImage: '/brand/mark.svg',
    publishedAt: '2026-09-07',
    updatedAt: '2026-09-07',
    seoTitle: 'Website Redesign SEO Checklist',
    metaDescription:
      'Plan a website redesign with a practical checklist for content inventory, URL mapping, mobile usability, tracking and post-launch checks.',
    canonicalPath: '/blog/website-redesign-seo-checklist',
    ogImage: '/blog/website-redesign-seo-checklist/opengraph-image',
    service: 'web-development',
    sections: [
      {
        heading: 'Start with what the existing site is doing',
        paragraphs: [
          'Before changing a layout, list the pages you already have and the purpose of each one. Review available search data, enquiries and internal feedback to understand which pages are useful.',
          'Record existing URLs alongside the proposed structure. This simple inventory helps prevent important information from disappearing during a redesign.',
        ],
      },
      {
        heading: 'Give every page a clear job',
        paragraphs: [
          'A service page should answer a commercial question: can this business solve the problem I have? A useful article can explain a narrower informational topic and link to the relevant service when it helps the reader.',
          'Do not create several near-identical pages for the same offer. Make navigation labels descriptive, and check whether a visitor can reach the important pages without relying on site search.',
        ],
      },
      {
        heading: 'Plan URL changes before development',
        paragraphs: [
          'Where a useful URL changes, map it to the closest relevant replacement. Implement permanent redirects and update internal links to point directly to the destination.',
          'Do not redirect every removed page to the homepage. If no equivalent content exists, decide whether the page should be retained, rewritten or return a genuine not-found response.',
        ],
      },
      {
        heading: 'Review the full enquiry journey',
        paragraphs: [
          'Check forms on small screens, with a keyboard and with invalid inputs. Make labels visible and error messages specific. Confirm that a successful message means the enquiry was actually stored or delivered.',
          'Review image dimensions, font loading and unnecessary scripts. A restrained interface can make both browsing and maintenance simpler.',
        ],
      },
      {
        heading: 'Monitor the launch',
        paragraphs: [
          'Before launch, confirm canonicals, sitemap entries, robots rules and analytics settings. After launch, inspect important URLs and watch for broken links and unexpected indexing changes.',
          'Treat launch as the beginning of a review cycle. Customer questions and search data can guide the next round of improvements.',
        ],
      },
    ],
  },
  {
    slug: 'building-a-useful-social-content-plan',
    title: 'A social content plan your business can actually maintain',
    excerpt:
      'Turn customer questions and everyday expertise into a focused, repeatable publishing rhythm.',
    author: 'Techie Growera Editorial',
    category: 'Social & Creative',
    tags: ['Content planning', 'Social media'],
    featuredImage: '/brand/mark.svg',
    publishedAt: '2026-09-07',
    updatedAt: '2026-09-07',
    seoTitle: 'How to Build a Useful Social Content Plan',
    metaDescription:
      'Create a manageable social content plan using customer questions, clear content themes, approval workflows and meaningful reporting.',
    canonicalPath: '/blog/building-a-useful-social-content-plan',
    ogImage: '/blog/building-a-useful-social-content-plan/opengraph-image',
    service: 'social-media-management',
    sections: [
      {
        heading: 'Choose a purpose before a posting frequency',
        paragraphs: [
          'Decide what the channel needs to do for your business. It may explain an unfamiliar service, show how your team works or help existing customers use a product.',
          'Choose a frequency that your team can support with useful material and a reliable review process. A calendar is a planning tool, not a reason to publish something with no clear purpose.',
        ],
      },
      {
        heading: 'Collect real questions',
        paragraphs: [
          'Ask the people who speak to customers which questions come up repeatedly. Save objections, practical how-to questions and misunderstandings about the service.',
          'Group those questions into a few clear themes. This gives creative work a source of relevant ideas without relying on unrelated trends.',
        ],
      },
      {
        heading: 'Match the format to the message',
        paragraphs: [
          'Use a simple graphic for a concise announcement, a carousel for a short sequence and a video when movement or a spoken explanation adds value.',
          'Keep important information readable on a phone. Review captions and on-screen text instead of assuming the audience will watch with sound.',
        ],
      },
      {
        heading: 'Make approvals part of the plan',
        paragraphs: [
          'For each piece, record the owner, draft date, review date and intended channel. Agree who checks product details and who makes the final publishing decision.',
          'Maintain a small buffer of approved content so an unexpectedly busy week does not force rushed posts.',
        ],
      },
      {
        heading: 'Review useful responses',
        paragraphs: [
          'Look beyond total likes. Questions, relevant profile visits and conversations can reveal whether the content helps the intended audience.',
          'Use the review to decide what to explain more clearly, what to repeat in a new format and what to stop producing.',
        ],
      },
    ],
  },
  {
    slug: 'before-your-first-meta-ads-campaign',
    title: 'Before your first Meta campaign: get the essentials in place',
    excerpt:
      'A clear offer, a useful landing page and an agreed measurement plan give testing a better starting point.',
    author: 'Techie Growera Editorial',
    category: 'Performance',
    tags: ['Meta Ads', 'Campaign planning'],
    featuredImage: '/brand/mark.svg',
    publishedAt: '2026-09-07',
    updatedAt: '2026-09-07',
    seoTitle: 'Preparing for Your First Meta Ads Campaign',
    metaDescription:
      'Prepare your offer, landing page, creative brief and measurement plan before starting a Facebook or Instagram advertising campaign.',
    canonicalPath: '/blog/before-your-first-meta-ads-campaign',
    ogImage: '/blog/before-your-first-meta-ads-campaign/opengraph-image',
    service: 'meta-ads',
    sections: [
      {
        heading: 'Define the action you want',
        paragraphs: [
          'Choose one primary action for the campaign. A useful definition is specific enough to verify, such as a completed enquiry for a particular service.',
          'Agree how the team will assess enquiry quality. A high volume of irrelevant submissions can consume time without moving the business forward.',
        ],
      },
      {
        heading: 'Make the offer understandable',
        paragraphs: [
          'Write down who the offer is for, the problem it addresses and what happens after someone responds. Make sure the ad and destination page communicate the same promise.',
          'Avoid claims you cannot support. Use genuine product information and clearly explain any important conditions.',
        ],
      },
      {
        heading: 'Check the destination',
        paragraphs: [
          'Open the landing page on a phone and complete the entire form. Check loading, field labels, errors and the confirmation message.',
          'Remove distractions that compete with the intended action while retaining the information someone needs to make an informed decision.',
        ],
      },
      {
        heading: 'Agree the measurement approach',
        paragraphs: [
          'Document which events matter and how they will be checked. Platform reporting and your own enquiry records may use different attribution rules, so do not assume they will match exactly.',
          'Any tracking implementation should respect the consent choices and requirements that apply to your audience.',
        ],
      },
      {
        heading: 'Test a clear hypothesis',
        paragraphs: [
          'Give each creative variation a reason to exist: a different question, benefit or way of demonstrating the offer. Changing everything at once makes the result harder to interpret.',
          'Agree the budget and review criteria before starting. Treat early results as evidence to learn from, not a guarantee of future performance.',
        ],
      },
    ],
  },
];
export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  demo: boolean;
  description: string;
  problem: string;
  solution: string;
  results: string;
  services: string[];
  technologies: string[];
  updatedAt: string;
  theme: string;
};
export const caseStudies: CaseStudy[] = [
  {
    slug: 'studio-north-concept',
    title: 'A clearer digital home for a design studio',
    client: 'Studio North',
    industry: 'Architecture & interiors',
    demo: true,
    description:
      'A concept showing how editorial design and a focused enquiry journey can work together.',
    problem:
      'The fictional brief explores a common challenge: presenting visual work without burying the services and enquiry path.',
    solution:
      'A project-led structure pairs generous imagery with concise service descriptions, project context and a direct enquiry journey.',
    results:
      'Concept deliverables: page architecture, interface direction and a sample enquiry flow. This is not client work; no live results or measured performance are claimed.',
    services: ['web-development', 'graphic-design'],
    technologies: ['Next.js', 'TypeScript', 'Responsive design'],
    updatedAt: '2026-09-07',
    theme: 'studio',
  },
  {
    slug: 'daily-form-concept',
    title: 'One recognizable identity, across every touchpoint',
    client: 'Daily Form',
    industry: 'Lifestyle & retail',
    demo: true,
    description:
      'An identity and social content concept for a fictional everyday essentials brand.',
    problem:
      'The fictional brand needs a recognizable system that works across product announcements, educational posts and campaign creative.',
    solution:
      'A limited colour palette, strong typography and repeatable layouts connect the visual identity with a practical content system.',
    results:
      'Concept deliverables: creative direction, sample content formats and campaign design principles. These are illustrative materials with no commercial results claimed.',
    services: ['graphic-design', 'social-media-management'],
    technologies: ['Brand system', 'Content planning', 'Campaign design'],
    updatedAt: '2026-09-07',
    theme: 'daily',
  },
];
