export type FAQ = { question: string; answer: string };
export type Service = {
  slug: string;
  name: string;
  short: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  problem: string;
  solution: string;
  benefits: string[];
  deliverables: string[];
  process: { title: string; text: string }[];
  useCases: string[];
  difference: string;
  faqs: FAQ[];
  related: string[];
};
export const services: Service[] = [
  {
    slug: 'web-development',
    name: 'Website Development',
    short: 'Fast. Intuitive. Built to convert.',
    eyebrow: '01 / WEB',
    title: 'Website development built around your business',
    description:
      'Responsive business websites, Next.js development, landing pages and redesigns with a strong foundation for search and conversion.',
    intro:
      'Give your business a website that explains your value, earns attention and makes the next step easy. We bring design, development and technical SEO together from the first wireframe.',
    problem:
      'A slow, confusing or outdated website can make even a great business hard to choose. Disconnected pages, unclear messaging and awkward mobile journeys create friction before a conversation starts.',
    solution:
      'We map the questions your customers need answered, design a clear journey, and build a responsive website with purposeful content and measurable actions.',
    benefits: [
      'A clear path from first visit to enquiry',
      'A consistent experience across screen sizes',
      'A maintainable foundation for new services and content',
    ],
    deliverables: [
      'Business website strategy and page architecture',
      'Custom responsive interface design',
      'Next.js development and reusable components',
      'Service and campaign landing pages',
      'Technical SEO and metadata setup',
      'Performance review, testing and handover',
    ],
    process: [
      {
        title: 'Map the journey',
        text: 'Agree the audience, site goals, page structure and content responsibilities.',
      },
      {
        title: 'Design with purpose',
        text: 'Review wireframes and visual design before development begins.',
      },
      {
        title: 'Build and refine',
        text: 'Implement pages, integrations and responsive interactions.',
      },
      {
        title: 'Launch with confidence',
        text: 'Check forms, indexing, speed and redirects, then document the handover.',
      },
    ],
    useCases: [
      'A service business launching its first professional website',
      'A growing company redesigning an outdated site',
      'A campaign that needs a focused landing page',
    ],
    difference:
      'Content, design and development are planned together. Search visibility and accessibility are part of the build rather than a last-minute plugin.',
    faqs: [
      {
        question: 'Can you redesign our existing website?',
        answer:
          'Yes. We start by reviewing its content, URLs, analytics access and current problems. Any changed URLs need a redirect plan so useful pages and existing links remain connected.',
      },
      {
        question: 'Will the website be SEO-friendly?',
        answer:
          'We build crawlable pages, descriptive metadata, internal links and a performance-conscious structure. Rankings also depend on useful content, competition and the authority your business develops.',
      },
      {
        question: 'What affects the project timeline?',
        answer:
          'The page count, content readiness, approval stages and integrations determine the schedule. We agree the scope and milestones before work starts.',
      },
    ],
    related: ['seo', 'graphic-design'],
  },
  {
    slug: 'seo',
    name: 'SEO Services',
    short: 'Get found for the right reasons.',
    eyebrow: '02 / SEARCH',
    title: 'SEO that starts with a stronger foundation',
    description:
      'Technical SEO, on-page optimization, keyword strategy and local SEO for businesses building sustainable organic visibility.',
    intro:
      'Connect what people search for with the expertise your business actually offers. We turn technical findings and search intent into a practical, prioritized SEO plan.',
    problem:
      'Publishing more pages will not solve unclear targeting or crawling problems. Many sites spread the same intent across several URLs while missing the questions that matter to their customers.',
    solution:
      'We audit how your site is discovered, interpreted and used. Then we prioritize technical repairs, page improvements and content opportunities by business relevance and implementation effort.',
    benefits: [
      'A clearer view of what is holding visibility back',
      'Pages aligned with distinct customer search intentions',
      'Reporting that connects search activity with meaningful enquiries',
    ],
    deliverables: [
      'Technical SEO audit and implementation backlog',
      'Search-intent and keyword-to-page mapping',
      'On-page titles, headings and internal linking',
      'Search Console and indexing review',
      'Core Web Vitals investigation',
      'Local SEO and content optimization where relevant',
    ],
    process: [
      {
        title: 'Establish the baseline',
        text: 'Review Search Console, site structure, indexability and existing content.',
      },
      {
        title: 'Prioritize the work',
        text: 'Separate critical technical issues from longer-term content opportunities.',
      },
      {
        title: 'Implement improvements',
        text: 'Resolve agreed issues and strengthen useful landing pages.',
      },
      {
        title: 'Learn from search',
        text: 'Monitor queries, indexed pages and conversions, then update the plan.',
      },
    ],
    useCases: [
      'A website with impressions but weak click-through',
      'A business whose important pages are not being indexed',
      'A local company improving its service-area content',
    ],
    difference:
      'You receive an understandable work plan and transparent progress. We do not promise first-place rankings or substitute keyword stuffing for useful content.',
    faqs: [
      {
        question: 'How quickly does SEO work?',
        answer:
          'There is no fixed timeline. Crawling, competition, site history and the scale of changes all affect progress. We establish a baseline and review trends over time instead of promising a deadline for rankings.',
      },
      {
        question: 'Do you provide local SEO?',
        answer:
          'Yes, when a business has a genuine service area. This can include business information consistency, location-relevant content and guidance for a legitimate Google Business Profile.',
      },
      {
        question: 'Can you work with our existing developers?',
        answer:
          'Yes. Technical recommendations can be delivered as prioritized tasks with context and acceptance criteria for your team.',
      },
    ],
    related: ['web-development', 'digital-marketing'],
  },
  {
    slug: 'graphic-design',
    name: 'Graphic Design',
    short: 'Make every impression count.',
    eyebrow: '03 / DESIGN',
    title: 'Graphic design that gives your brand a clear voice',
    description:
      'Brand identity, social media creatives, ad designs and business materials with a consistent visual direction.',
    intro:
      'From a first introduction to a daily social post, your visual identity should feel like one business. We create practical design systems and assets that make your message easier to recognize.',
    problem:
      'One-off creatives often leave a brand feeling inconsistent. Different fonts, competing colours and crowded layouts can make good offers difficult to understand.',
    solution:
      'We establish a clear hierarchy, a consistent visual language and formats suited to where each design will appear. Every asset starts with the message and the intended audience.',
    benefits: [
      'A recognizable visual identity across channels',
      'Clearer communication of offers and information',
      'Reusable assets that simplify future production',
    ],
    deliverables: [
      'Brand direction and visual guidelines',
      'Social media post and carousel creatives',
      'Advertising creative concepts and variations',
      'Posters, brochures and business materials',
      'Campaign design systems',
      'Exported assets and agreed editable source files',
    ],
    process: [
      {
        title: 'Understand the message',
        text: 'Collect brand references, audience context and required formats.',
      },
      {
        title: 'Set the direction',
        text: 'Agree the visual hierarchy and a focused creative concept.',
      },
      {
        title: 'Develop the assets',
        text: 'Design the agreed formats and refine them through scoped feedback.',
      },
      {
        title: 'Prepare delivery',
        text: 'Export files with clear naming, dimensions and usage notes.',
      },
    ],
    useCases: [
      'A new brand establishing its visual identity',
      'A team needing consistent monthly social creatives',
      'A business launching an offer across print and digital',
    ],
    difference:
      'We design for real production needs: legibility, channel dimensions, editable handover and consistency across a whole campaign.',
    faqs: [
      {
        question: 'Can you work with our existing brand guidelines?',
        answer:
          'Yes. Share your logo, fonts, colours and usage rules. We can extend the existing identity while keeping new assets consistent.',
      },
      {
        question: 'Are editable files included?',
        answer:
          'The agreed proposal specifies source formats, licensing and deliverables. We clarify handover requirements before design begins.',
      },
      {
        question: 'Can you make creative variants for ads?',
        answer:
          'Yes. Variants can test different hooks, layouts and messages while preserving brand consistency.',
      },
    ],
    related: ['social-media-management', 'meta-ads'],
  },
  {
    slug: 'video-editing',
    name: 'Video Editing',
    short: 'Turn attention into connection.',
    eyebrow: '04 / MOTION',
    title: 'Video editing made for the way people watch',
    description:
      'Reels, short-form videos, promotional edits and video ad creatives with clear storytelling, captions and channel-ready exports.',
    intro:
      'Turn your footage into a story people can follow. We shape the hook, pacing, sound and on-screen message around your audience and the platform.',
    problem:
      'Good footage can still lose its message through slow openings, distracting effects or unclear audio. Reusing the same export everywhere can also hide key text or crop the subject.',
    solution:
      'We build each edit around one clear idea, then adapt the aspect ratio, captions and pacing for the intended channel. Motion supports the story instead of overwhelming it.',
    benefits: [
      'A stronger opening and clearer narrative',
      'Captioned edits that communicate without sound',
      'Exports designed for each publishing format',
    ],
    deliverables: [
      'Reels and short-form social edits',
      'Promotional and product videos from supplied footage',
      'Video ad variations and alternate hooks',
      'Captions, titles and branded motion elements',
      'Audio balancing and colour correction',
      'Channel-specific exports and cover frames',
    ],
    process: [
      {
        title: 'Review the footage',
        text: 'Confirm the story, source quality, asset rights and output requirements.',
      },
      {
        title: 'Shape the first cut',
        text: 'Build the narrative and timing before adding visual polish.',
      },
      {
        title: 'Refine the details',
        text: 'Improve sound, captions, colour and transitions through feedback.',
      },
      {
        title: 'Export for the channel',
        text: 'Check aspect ratios, safe areas and final playback.',
      },
    ],
    useCases: [
      'Founders turning recorded insights into short videos',
      'Brands creating product launch edits',
      'Marketing teams testing short-form ad hooks',
    ],
    difference:
      'The focus stays on communication. Thoughtful cuts, readable captions and clean sound do more for a story than a long list of effects.',
    faqs: [
      {
        question: 'Do you need us to provide footage?',
        answer:
          'This service is based on supplied footage and agreed licensed assets. Filming requirements can be discussed separately when scoping the project.',
      },
      {
        question: 'Can one video be adapted for multiple platforms?',
        answer:
          'Yes. We can prepare separate aspect ratios, lengths and caption placements for the channels in your scope.',
      },
      {
        question: 'Can you add subtitles?',
        answer:
          'Yes. We can add reviewed on-screen captions or provide subtitle files where required. You should verify names and specialist terminology during review.',
      },
    ],
    related: ['social-media-management', 'meta-ads'],
  },
  {
    slug: 'social-media-management',
    name: 'Social Media Management',
    short: 'Show up with a purpose.',
    eyebrow: '05 / SOCIAL',
    title: 'Social media management with a consistent direction',
    description:
      'Social content planning, post and reel strategy, creative production, account management and useful reporting for businesses.',
    intro:
      'Build an intentional presence that reflects your business. We connect content themes, creative production and a realistic publishing rhythm.',
    problem:
      'Posting only when time allows often creates gaps, repeated messages and content that has little connection to business goals. Activity alone is not a strategy.',
    solution:
      'We define the role of each channel, build a content calendar and establish a review process. Regular reporting helps distinguish useful audience responses from vanity metrics.',
    benefits: [
      'A planned publishing rhythm your team can sustain',
      'Content aligned with customer questions and brand goals',
      'Clear ownership of creation, approval and reporting',
    ],
    deliverables: [
      'Channel and audience review',
      'Content pillars and monthly calendar',
      'Post, carousel and reel planning',
      'Creative production within an agreed scope',
      'Scheduling and account management',
      'Performance reports and content recommendations',
    ],
    process: [
      {
        title: 'Find the focus',
        text: 'Define the audience and the business purpose of each channel.',
      },
      {
        title: 'Plan the calendar',
        text: 'Balance education, proof, brand stories and relevant offers.',
      },
      {
        title: 'Create and publish',
        text: 'Work through a shared approval workflow and agreed schedule.',
      },
      {
        title: 'Review and adapt',
        text: 'Use audience responses to improve the next content cycle.',
      },
    ],
    useCases: [
      'A business starting a structured social presence',
      'A small team needing reliable content production',
      'A brand consolidating inconsistent channel messaging',
    ],
    difference:
      'We define the operational details upfront: channels, content volume, approvals and community-response responsibilities.',
    faqs: [
      {
        question: 'Which platforms should our business use?',
        answer:
          'The choice depends on your audience, content resources and objectives. We recommend a manageable channel mix after understanding where your customers spend time.',
      },
      {
        question: 'Is advertising included?',
        answer:
          'Paid campaign management and ad spend are scoped separately. Organic content can support advertising, but they have different budgets and responsibilities.',
      },
      {
        question: 'Will we approve content before publishing?',
        answer:
          'An approval process is agreed during onboarding. You can review planned content before it is scheduled.',
      },
    ],
    related: ['graphic-design', 'video-editing'],
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    short: 'Connect the whole customer journey.',
    eyebrow: '06 / STRATEGY',
    title: 'Digital marketing with a connected plan',
    description:
      'Digital marketing strategy that connects your website, content, search, social channels and measurement around business goals.',
    intro:
      'Make your channels work toward the same outcome. We help you choose the right priorities and turn a collection of marketing activities into a coherent customer journey.',
    problem:
      'Separate campaigns can send different messages or measure different definitions of success. Without a clear journey, more traffic can simply create more drop-off.',
    solution:
      'We map discovery, consideration and conversion, then identify where your website, content and campaigns need to support each other. The plan reflects your resources and commercial priorities.',
    benefits: [
      'A shared direction across marketing channels',
      'Clear priorities instead of disconnected activity',
      'Measurement built around meaningful business actions',
    ],
    deliverables: [
      'Audience and customer journey mapping',
      'Channel strategy and campaign planning',
      'Messaging and offer recommendations',
      'Landing page and conversion review',
      'Measurement plan and campaign naming conventions',
      'Regular performance review and next-step priorities',
    ],
    process: [
      {
        title: 'Understand the business',
        text: 'Discuss offers, customers, constraints and current marketing activity.',
      },
      {
        title: 'Connect the journey',
        text: 'Identify gaps between discovery, evaluation and enquiry.',
      },
      {
        title: 'Activate the priorities',
        text: 'Coordinate the agreed website, content and campaign improvements.',
      },
      {
        title: 'Review the evidence',
        text: 'Compare meaningful actions and lead quality with the original objectives.',
      },
    ],
    useCases: [
      'A growing business coordinating multiple channels',
      'A new offer needing an integrated launch plan',
      'A team that needs a clear marketing roadmap',
    ],
    difference:
      'We start with what your business can realistically execute, then focus the plan on the customer journey and the decisions that matter.',
    faqs: [
      {
        question: 'Do we need every marketing channel?',
        answer:
          'No. A focused channel mix is often easier to execute well. We choose priorities based on audience fit, resources and the goals of the business.',
      },
      {
        question: 'How do you measure success?',
        answer:
          'We agree relevant actions such as qualified enquiries, purchases or booked conversations. Channel metrics provide context but are not automatically business outcomes.',
      },
      {
        question: 'Can you work alongside our internal team?',
        answer:
          'Yes. Responsibilities can be split between strategy, production and implementation with a clear review process.',
      },
    ],
    related: ['seo', 'meta-ads'],
  },
  {
    slug: 'meta-ads',
    name: 'Meta Ads & Performance Marketing',
    short: 'Test thoughtfully. Learn continuously.',
    eyebrow: '07 / PERFORMANCE',
    title: 'Meta Ads built around testing and better decisions',
    description:
      'Facebook and Instagram campaign planning, lead generation, creative testing, remarketing and conversion tracking for businesses.',
    intro:
      'Reach relevant audiences with a clear offer and a structured testing plan. We connect campaign setup, creative and measurement so your next decision has better evidence.',
    problem:
      'Boosting posts without a defined objective makes results difficult to interpret. Weak offers, inconsistent tracking and a disconnected landing page can undermine campaign performance.',
    solution:
      'We review campaign readiness, agree the conversion goal and create a measured testing plan. Campaign optimization considers creative response and lead quality as well as platform metrics.',
    benefits: [
      'An agreed testing plan and clear budget boundaries',
      'Creative learning that informs future campaigns',
      'A closer connection between ad clicks and business outcomes',
    ],
    deliverables: [
      'Account and campaign readiness review',
      'Lead generation or conversion campaign setup',
      'Audience strategy and appropriate remarketing',
      'Creative concepts and testing variations',
      'Pixel and conversion tracking coordination with consent',
      'Optimization and transparent performance reporting',
    ],
    process: [
      {
        title: 'Check readiness',
        text: 'Review the offer, landing page, account access and measurement requirements.',
      },
      {
        title: 'Build the test',
        text: 'Define hypotheses, creative variations, budget and evaluation criteria.',
      },
      {
        title: 'Launch and monitor',
        text: 'Check delivery and tracking, then monitor agreed performance signals.',
      },
      {
        title: 'Refine with evidence',
        text: 'Evaluate creative and audience learnings before changing the campaign.',
      },
    ],
    useCases: [
      'A service business testing lead-generation campaigns',
      'An established brand improving campaign measurement',
      'A product launch testing different creative angles',
    ],
    difference:
      'Ad spend remains visible and separate from service fees. We communicate what the data can support without guaranteeing leads or returns.',
    faqs: [
      {
        question: 'Is ad spend included in your service fee?',
        answer:
          'No. Advertising spend and management fees are separate and agreed before launch. Your business retains ownership of its advertising accounts.',
      },
      {
        question: 'Can you guarantee a cost per lead?',
        answer:
          'No. Auction conditions, creative, offer, audience and landing-page experience all affect costs. We use controlled testing to inform improvements.',
      },
      {
        question: 'Do you set up conversion tracking?',
        answer:
          'We can coordinate platform tracking and event definitions. Implementation depends on your website, consent requirements and the agreed scope.',
      },
    ],
    related: ['graphic-design', 'web-development'],
  },
];
export const getService = (slug: string) => services.find((service) => service.slug === slug);
export const generalFaqs: FAQ[] = [
  {
    question: 'What can Techie Growera help us with?',
    answer:
      'We bring together website development, SEO, graphic design, video editing, social media management and performance marketing. Start with a specific need or discuss how these services can work together.',
  },
  {
    question: 'Can we start with just one service?',
    answer:
      'Absolutely. We can scope a focused project first and expand the work when there is a clear business reason to do so.',
  },
  {
    question: 'How do you price a project?',
    answer:
      'Pricing depends on the deliverables, complexity and ongoing support required. Share your brief and we will discuss a defined scope before providing a quote.',
  },
  {
    question: 'Do you guarantee search rankings or leads?',
    answer:
      'No. We commit to thoughtful implementation, transparent communication and a clear review process. Search rankings and advertising outcomes depend on factors beyond any agency’s control.',
  },
];
