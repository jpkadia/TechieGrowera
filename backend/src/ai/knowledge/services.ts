export interface ServiceKnowledge {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  problemSolved: string;
  ourSolution: string;
  deliverables: string[];
  keyBenefits: string[];
  targetAudience: string[];
  pricingModel: string;
}

export const servicesKnowledge: ServiceKnowledge[] = [
  {
    id: 'web-development',
    name: 'Website Development',
    shortDescription: 'Fast, intuitive, and built to convert.',
    detailedDescription:
      'Custom business websites, Next.js web applications, responsive landing pages, and redesigns built with a strong foundation for organic search, speed, and conversion.',
    problemSolved:
      'Slow, outdated, or confusing websites that create friction before conversations start, leading to high bounce rates and lost leads.',
    ourSolution:
      'We map user journeys, design clean visual hierarchies, and build custom web applications using Next.js, React, TypeScript, and modern headless backends with sub-second page loads.',
    deliverables: [
      'Custom responsive interface and UX wireframing',
      'Next.js (App Router) & React full-stack development',
      'Reusable component architectures and design systems',
      'Lead generation landing pages & corporate portfolios',
      'Technical SEO, Schema.org metadata, and Core Web Vitals optimization',
      'Backend REST API integrations, security hardening, and deployment',
    ],
    keyBenefits: [
      'Sub-second load times and 95+ Google Lighthouse scores',
      'Seamless experience across desktop, tablet, and mobile devices',
      'Scalable, maintainable codebase ready for future expansion',
    ],
    targetAudience: [
      'Service businesses launching their first high-authority professional site',
      'Growing companies redesigning outdated, slow WordPress websites',
      'Startups and products needing conversion-focused landing pages',
    ],
    pricingModel: 'Custom scoped based on page count, functionality, and integrations. Inquire for a detailed proposal.',
  },
  {
    id: 'seo',
    name: 'SEO (Search Engine Optimization) Services',
    shortDescription: 'Get found for the right reasons.',
    detailedDescription:
      'Technical SEO, on-page optimization, keyword intent strategy, and local search visibility for businesses building sustainable organic customer acquisition.',
    problemSolved:
      'Websites with zero organic search traffic, broken crawling/indexing, or low-intent rankings that fail to generate qualified enquiries.',
    ourSolution:
      'We conduct exhaustive technical audits, fix crawl barriers, structure site taxonomy, optimize Core Web Vitals, and build search-intent landing pages that rank for high-intent business terms.',
    deliverables: [
      'Comprehensive technical SEO audit and fix implementation',
      'Keyword research and search-intent to page mapping',
      'On-page titles, meta descriptions, headings, and internal linking',
      'Google Search Console setup and indexation monitoring',
      'Core Web Vitals and page experience optimization',
      'Local SEO, Google Business Profile consistency, and service-area targeting',
    ],
    keyBenefits: [
      'Compounding, long-term organic traffic without recurring ad spend',
      'Targeted traffic from customers actively searching for your solutions',
      'Clear, transparent reporting on rankings, clicks, and enquiries',
    ],
    targetAudience: [
      'Businesses with traffic but poor conversion, or zero Google rankings',
      'Local service providers wanting dominant local search visibility',
      'E-commerce and SaaS brands scaling inbound organic reach',
    ],
    pricingModel: 'Monthly retainer or one-time technical foundation package depending on site scale.',
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design & Brand Identity',
    shortDescription: 'Make every impression count.',
    detailedDescription:
      'Brand identity systems, logo design, social media creatives, ad banners, pitch decks, and marketing collateral with an unmistakable, consistent visual direction.',
    problemSolved:
      'Inconsistent visual branding, amateur social graphics, and disjointed creative assets that diminish perceived brand value and trust.',
    ourSolution:
      'We craft comprehensive visual identity guidelines, clear typography systems, and reusable graphic design templates tailored to every publishing channel.',
    deliverables: [
      'Brand identity guidelines, color palettes, and typography rules',
      'Logo design and brand mark vector files',
      'High-converting social media creatives and carousel packs',
      'Digital ad creatives for Meta, Google, and LinkedIn campaigns',
      'Corporate pitch decks, brochures, and digital stationery',
      'Production-ready exported assets and source files (Figma/Adobe)',
    ],
    keyBenefits: [
      'Instantly recognizable visual identity across all digital touchpoints',
      'Higher credibility and stronger brand trust from prospective clients',
      'Turnaround-ready creative assets for marketing campaigns',
    ],
    targetAudience: [
      'New brands establishing their core visual identity',
      'Established companies refreshing their brand assets',
      'Marketing teams needing consistent high-volume social creatives',
    ],
    pricingModel: 'Project-based brand identity package or monthly creative retainer.',
  },
  {
    id: 'video-editing',
    name: 'Video Editing & Motion Graphics',
    shortDescription: 'Turn attention into connection.',
    detailedDescription:
      'Instagram Reels, YouTube Shorts, promotional videos, and high-impact video ads featuring captivating hooks, tight pacing, sound design, and custom captions.',
    problemSolved:
      'Raw, unedited footage with slow hooks, awkward pauses, or poor audio that viewers swipe past within the first 2 seconds.',
    ourSolution:
      'We transform supplied raw footage into retention-optimized short and long-form videos with strategic hooks, color grading, sound effects, dynamic b-roll, and readable on-screen subtitles.',
    deliverables: [
      'Viral-ready Reels, TikToks, and YouTube Shorts (9:16 vertical format)',
      'Brand promotional and founder thought-leadership video cuts',
      'High-converting video ad creatives with multiple hook variations',
      'Synchronized subtitles, motion typography, and sound design',
      'Color grading, audio balancing, and noise removal',
      'Channel-optimized exports (16:9, 1:1, 9:16) with thumbnail frames',
    ],
    keyBenefits: [
      'Higher viewer retention and completion rates on short-form algorithms',
      'Videos that communicate clearly even with audio muted via on-screen captions',
      'Consistent, polished video presence that positions founders as authorities',
    ],
    targetAudience: [
      'Founders and creators turning spoken insights into short-form content',
      'E-commerce brands launching promotional product videos',
      'Performance marketers needing video ad variants for paid campaigns',
    ],
    pricingModel: 'Per-video package or monthly video editing retainer.',
  },
  {
    id: 'social-media-management',
    name: 'Social Media Management',
    shortDescription: 'Show up with a purpose.',
    detailedDescription:
      'End-to-end social media strategy, content planning, post and reel creation, scheduling, community management, and actionable growth analytics.',
    problemSolved:
      'Irregular posting, lack of consistent content themes, low engagement, and wasting time on posts that fail to generate meaningful business leads.',
    ourSolution:
      'We establish distinct content pillars (education, proof, brand stories, offers), design a monthly content calendar, manage approvals, and track conversion-oriented metrics.',
    deliverables: [
      'Channel audit and audience demographic research',
      'Monthly content calendar with distinct publishing pillars',
      'Creative asset production (posts, carousels, reels)',
      'Compelling copywriting, captions, and hashtag optimization',
      'Scheduling, distribution, and community engagement guidance',
      'Monthly analytics reporting and actionable optimization recommendations',
    ],
    keyBenefits: [
      'A steady, reliable publishing rhythm without overwhelming your team',
      'Content specifically engineered to answer client questions and generate enquiries',
      'Strategic brand authority built systematically over time',
    ],
    targetAudience: [
      'Businesses wanting an intentional, consistent presence on Instagram & LinkedIn',
      'Founders who lack the internal bandwidth to design and post regularly',
      'Brands wanting to turn passive followers into active clients',
    ],
    pricingModel: 'Monthly management tier based on posting frequency and creative scope.',
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing & Growth Strategy',
    shortDescription: 'Connect the whole customer journey.',
    detailedDescription:
      'Holistic digital marketing strategy connecting website funnels, content marketing, search, social channels, and conversion rate optimization toward revenue goals.',
    problemSolved:
      'Disconnected marketing activities where website, ads, and social operate in silos, creating high traffic drop-off and unmeasured marketing spend.',
    ourSolution:
      'We map the customer lifecycle from initial awareness to final sale, aligning each channel to eliminate drop-off and maximize customer conversion.',
    deliverables: [
      'Customer journey and acquisition funnel mapping',
      'Omnichannel strategy and campaign coordination',
      'Landing page conversion rate optimization (CRO) audits',
      'Offer positioning, value proposition refinement, and messaging guides',
      'Multi-touch attribution tracking and KPI measurement frameworks',
      'Quarterly growth reviews and prioritization roadmaps',
    ],
    keyBenefits: [
      'Unified marketing roadmap with clear priorities and accountability',
      'Better ROI on marketing investments through connected funnels',
      'Decisions driven by real customer conversion data rather than guesswork',
    ],
    targetAudience: [
      'Growing companies coordinating multiple marketing channels simultaneously',
      'Businesses launching new products or services needing end-to-end strategy',
      'Teams wanting to fix conversion leaks in their existing funnel',
    ],
    pricingModel: 'Strategic advisory retainer or scoped growth consulting project.',
  },
  {
    id: 'meta-ads',
    name: 'Meta Ads & Paid Media Performance',
    shortDescription: 'Test thoughtfully. Learn continuously.',
    detailedDescription:
      'Facebook and Instagram performance ad campaigns, lead generation funnels, creative split-testing, custom audience retargeting, and ROAS optimization.',
    problemSolved:
      'Burning ad budget on "boosted posts" with vague objectives, high cost-per-lead, inaccurate pixel tracking, and poor lead quality.',
    ourSolution:
      'We design structured testing methodologies, test distinct hooks and angles, build high-converting landing experiences, and monitor real backend lead quality.',
    deliverables: [
      'Meta Business Suite and ad account structure audit',
      'Targeted lead generation or conversion campaign build',
      'Audience segmentation, lookalikes, and custom retargeting funnels',
      'Creative variations (hooks, headlines, video cuts, carousel cards)',
      'Meta Pixel and Conversions API (CAPI) tracking configuration',
      'Rigorous A/B testing, budget pacing, and ROAS performance reporting',
    ],
    keyBenefits: [
      'Controlled, predictable customer acquisition pipeline',
      'Transparent ad spend (client retains direct ownership of their ad account)',
      'Actionable creative insights that inform broader company messaging',
    ],
    targetAudience: [
      'Service companies needing a steady influx of qualified sales leads',
      'E-commerce brands seeking profitable return on ad spend (ROAS)',
      'Businesses ready to scale beyond purely organic channels',
    ],
    pricingModel: 'Management fee based on ad spend tier; ad spend is paid directly to Meta by the client.',
  },
];
