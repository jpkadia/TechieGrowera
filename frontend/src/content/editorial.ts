export type ContentSection = { heading: string; paragraphs: string[] };
export type BlogPost = {
  slug: string;
  title: string;
  shortTitle?: string;
  excerpt: string;
  author: string;
  authorType?: 'Organization' | 'Person';
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
    slug: 'website-redesign-seo',
    title: 'Planning a website redesign? Protect the foundations first.',
    shortTitle: 'Website Redesign SEO',
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
    canonicalPath: '/blog/website-redesign-seo',
    ogImage: '/blog/website-redesign-seo/opengraph-image',
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
    slug: 'social-content-plan',
    title: 'A social content plan your business can actually maintain',
    shortTitle: 'Social Content Plan',
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
    canonicalPath: '/blog/social-content-plan',
    ogImage: '/blog/social-content-plan/opengraph-image',
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
    slug: 'meta-ads-campaign',
    title: 'Before your first Meta campaign: get the essentials in place',
    shortTitle: 'Meta Ads Campaign',
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
    canonicalPath: '/blog/meta-ads-campaign',
    ogImage: '/blog/meta-ads-campaign/opengraph-image',
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
export type PortfolioItem = {
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
export type PortfolioProject = PortfolioItem;

export const portfolio: PortfolioItem[] = [
  {
    slug: 'cartel-369',
    title: 'Cartel 369 — Healthcare & Pharma Ecosystem',
    client: 'Cartel 369',
    industry: 'Healthcare & Life Sciences',
    demo: false,
    description:
      'A premier deal-enabled digital platform bridging innovative healthcare startups with global pharmaceutical giants and MedTech leaders.',
    problem:
      'Healthcare startups and innovative operators face complex regulatory hurdles and high friction when attempting to reach decision-makers inside corporate pharmaceutical and MedTech organizations. Without high-authority digital presence and structured partnership pathways, promising healthcare technologies struggle to transition from pilot concepts to commercial growth and strategic contracts.',
    solution:
      'Architected and developed a modern, high-performance web platform for Cartel 369 using React.js. Created dedicated access funnels for startups and pharmaceutical leaders, designed enterprise-grade visual hierarchy, and implemented responsive layout structures that build immediate institutional trust across all devices.',
    results:
      'Successfully launched the official Cartel 369 platform (live at cartel369.com), delivering sub-second load times and seamless partner onboarding. The platform now serves as the central hub for strategic B2B matchmaking, healthcare innovation scale-ups, and corporate deal flow.',
    services: ['web-development', 'digital-marketing'],
    technologies: ['React.js', 'Single Page Application', 'REST APIs', 'Responsive Design', 'Vercel Deployment'],
    theme: 'studio',
    updatedAt: '2026-09-21',
  },
  {
    slug: 'doctor-gen-ai',
    title: 'Doctor Gen AI — AI Healthcare & Patient Portal',
    client: 'Doctor Gen AI',
    industry: 'HealthTech & Artificial Intelligence',
    demo: false,
    description:
      'An advanced AI-driven healthcare portal providing automated medical assistance, patient consultations, intelligent reporting, and appointment scheduling.',
    problem:
      'Modern clinics and medical practices struggle with heavy patient query volumes, phone-based appointment bottlenecks, and delays in reviewing patient health histories. The client needed an intelligent web-based medical portal that could provide preliminary AI health guidance, schedule doctor visits, and automate report analysis securely.',
    solution:
      'Engineered a full-stack AI healthcare web application with a responsive React/Vite frontend and an Express.js backend deployed on Render. Integrated generative AI APIs for responsive health assistance, built a doctor appointment scheduling system, and created an intuitive patient portal with high-contrast, accessible UI design.',
    results:
      'Delivered a functional AI healthcare portal (live at doctor-gen-ai.vercel.app) achieving sub-1.5s AI query responses, automated patient intake, and a mobile-friendly appointment flow that significantly lowers clinic front-desk administrative workload.',
    services: ['web-development', 'digital-marketing'],
    technologies: ['Vite', 'React.js', 'Node.js', 'Express.js', 'Generative AI', 'Render Backend'],
    theme: 'daily',
    updatedAt: '2026-09-21',
  },
  {
    slug: 'lathrix-haircare',
    title: 'LàThrix — Modern Haircare Product Showcase',
    client: 'LàThrix',
    industry: 'Beauty & Personal Care eCommerce',
    demo: false,
    description:
      'A bespoke, modern direct-to-consumer product showcase website featuring interactive visuals, product benefits, and high-conversion landing structure.',
    problem:
      'In the competitive beauty and hair care landscape, standard e-commerce templates fail to communicate product formulation quality and active benefits. LàThrix needed a striking visual product landing experience that captures attention, educates customers on ingredients, and drives purchase confidence across mobile and desktop devices.',
    solution:
      'Crafted an interactive product showcase website with React.js, featuring rich product imagery, custom ingredient highlights, smooth component animations, and a focused conversion-oriented layout. Optimized asset delivery and implemented clean typography that reflects the brand’s premium care positioning.',
    results:
      'Launched the digital product showcase (live at parth-kadiya.github.io/lathrix), achieving 60fps smooth scrolling, instant page loading, and an engaging visual presentation that increased user exploration time and product credibility.',
    services: ['web-development', 'graphic-design'],
    technologies: ['React.js', 'Interactive UI Components', 'CSS3 Animations', 'Responsive Design', 'GitHub Pages'],
    theme: 'studio',
    updatedAt: '2026-09-21',
  },
  {
    slug: 'dr-karnav-patel',
    title: 'Dr. Karnav Patel — Clinic & Appointment Portal',
    client: 'Dr. Karnav Patel',
    industry: 'Dermatology & Medical Practice',
    demo: false,
    description:
      'A comprehensive digital clinic portal for leading dermatologist Dr. Karnav Patel, featuring detailed treatment guides and streamlined appointment bookings.',
    problem:
      'Patients looking for specialized clinical and cosmetic dermatology treatments in Ahmedabad needed a trustworthy, easy-to-use digital home to explore Dr. Karnav Patel\'s expertise, review clinic locations (Apollo Hospital), and book appointments without navigating complex hospital switchboards.',
    solution:
      'Built a mobile-first clinic web portal featuring comprehensive treatment breakdowns for clinical dermatology and laser cosmetic care, verified patient testimonials, doctor background information, and an integrated appointment booking form with smooth scroll transitions.',
    results:
      'Delivered a professional, high-performance medical practice website (live at parth-kadiya.github.io/sample-doctor-website) that streamlined patient enquiry handling, enhanced practitioner credibility, and improved mobile accessibility for patients across Ahmedabad.',
    services: ['web-development', 'seo'],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'AOS Animations', 'Responsive Mobile-First', 'Appointment Form'],
    theme: 'daily',
    updatedAt: '2026-09-21',
  },
];

export function getPostBoxTitle(post: {
  slug?: string;
  shortTitle?: string;
  title: string;
  category?: string;
}): string {
  if (post.shortTitle && post.shortTitle.trim()) {
    return post.shortTitle.trim();
  }

  const presetShortTitles: Record<string, string> = {
    'website-redesign-seo': 'Website Redesign SEO',
    'website-redesign-seo-checklist': 'Website Redesign SEO',
    'social-content-plan': 'Social Content Plan',
    'building-a-useful-social-content-plan': 'Social Content Plan',
    'meta-ads-campaign': 'Meta Ads Campaign',
    'before-your-first-meta-ads-campaign': 'Meta Ads Campaign',
  };

  if (post.slug && presetShortTitles[post.slug]) {
    return presetShortTitles[post.slug];
  }

  if (post.title) {
    const colonSplit = post.title.split(':');
    if (colonSplit.length > 1 && colonSplit[0].trim().length >= 4 && colonSplit[0].trim().length <= 32) {
      return colonSplit[0].trim();
    }
    const questionSplit = post.title.split('?');
    if (questionSplit.length > 1 && questionSplit[0].trim().length >= 4 && questionSplit[0].trim().length <= 32) {
      return questionSplit[0].trim();
    }
    const dashSplit = post.title.split(/[\u2014-]/);
    if (dashSplit.length > 1 && dashSplit[0].trim().length >= 4 && dashSplit[0].trim().length <= 32) {
      return dashSplit[0].trim();
    }
    if (post.title.length > 26) {
      const truncated = post.title.slice(0, 26);
      const lastSpace = truncated.lastIndexOf(' ');
      return (lastSpace > 10 ? truncated.slice(0, lastSpace) : truncated).trim();
    }
    return post.title.trim();
  }

  return post.category || 'Article';
}

export const portfolioProjects = portfolio;

