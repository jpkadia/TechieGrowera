export interface PortfolioKnowledge {
  slug: string;
  projectName: string;
  client: string;
  industry: string;
  liveUrl?: string;
  summary: string;
  problem: string;
  solution: string;
  results: string;
  servicesProvided: string[];
  technologiesUsed: string[];
}

export const portfolioKnowledge: PortfolioKnowledge[] = [
  {
    slug: 'cartel-369',
    projectName: 'Cartel 369 — Healthcare & Pharma Ecosystem',
    client: 'Cartel 369',
    industry: 'Healthcare & Life Sciences B2B Deal Platform',
    liveUrl: 'https://cartel369.com',
    summary:
      'A premier deal-enabled digital platform bridging innovative healthcare startups with global pharmaceutical giants and MedTech leaders.',
    problem:
      'Healthcare startups and innovative operators face complex regulatory hurdles and high friction when attempting to reach decision-makers inside corporate pharmaceutical and MedTech organizations. Without a high-authority digital presence and structured partnership pathways, promising healthcare technologies struggle to transition from pilot concepts to commercial growth.',
    solution:
      'Architected and developed a modern, high-performance web platform for Cartel 369 using React.js. Created dedicated access funnels for startups and pharmaceutical leaders, designed enterprise-grade visual hierarchy, and implemented responsive layout structures that build immediate institutional trust.',
    results:
      'Successfully launched the official Cartel 369 platform delivering sub-second load times and seamless partner onboarding. The platform now serves as the central hub for strategic B2B matchmaking, healthcare innovation scale-ups, and corporate deal flow.',
    servicesProvided: ['Website Development', 'Digital Marketing'],
    technologiesUsed: ['React.js', 'Single Page Application', 'REST APIs', 'Responsive Design', 'Vercel Deployment'],
  },
  {
    slug: 'doctor-gen-ai',
    projectName: 'Doctor Gen AI — AI Healthcare & Patient Portal',
    client: 'Doctor Gen AI',
    industry: 'HealthTech & Artificial Intelligence',
    liveUrl: 'https://doctor-gen-ai.vercel.app',
    summary:
      'An advanced AI-driven healthcare portal providing automated medical assistance, patient consultations, intelligent reporting, and appointment scheduling.',
    problem:
      'Modern clinics and medical practices struggle with heavy patient query volumes, phone-based appointment bottlenecks, and delays in reviewing patient health histories. The client needed an intelligent web-based medical portal that could provide preliminary AI health guidance, schedule doctor visits, and automate report analysis securely.',
    solution:
      'Engineered a full-stack AI healthcare web application with a responsive React/Vite frontend and an Express.js backend deployed on Render. Integrated generative AI APIs for responsive health assistance, built a doctor appointment scheduling system, and created an intuitive patient portal with high-contrast, accessible UI design.',
    results:
      'Delivered a functional AI healthcare portal achieving sub-1.5s AI query responses, automated patient intake, and a mobile-friendly appointment flow that significantly lowers clinic front-desk administrative workload.',
    servicesProvided: ['Website Development', 'Digital Marketing', 'AI Integration'],
    technologiesUsed: ['Vite', 'React.js', 'Node.js', 'Express.js', 'Generative AI APIs', 'Render Backend'],
  },
  {
    slug: 'lathrix-haircare',
    projectName: 'LàThrix — Modern Haircare Product Showcase',
    client: 'LàThrix',
    industry: 'Beauty & Personal Care eCommerce',
    liveUrl: 'https://parth-kadiya.github.io/lathrix',
    summary:
      'A bespoke, modern direct-to-consumer product showcase website featuring interactive visuals, product benefits, and high-conversion landing structure.',
    problem:
      'In the competitive beauty and hair care landscape, standard e-commerce templates fail to communicate product formulation quality and active benefits. LàThrix needed a striking visual product landing experience that captures attention, educates customers on ingredients, and drives purchase confidence across mobile and desktop devices.',
    solution:
      'Crafted an interactive product showcase website with React.js, featuring rich product imagery, custom ingredient highlights, smooth component animations, and a focused conversion-oriented layout. Optimized asset delivery and implemented clean typography that reflects the brand’s premium care positioning.',
    results:
      'Launched the digital product showcase achieving 60fps smooth scrolling, instant page loading, and an engaging visual presentation that increased user exploration time and product credibility.',
    servicesProvided: ['Website Development', 'Graphic Design'],
    technologiesUsed: ['React.js', 'Interactive UI Components', 'CSS3 Animations', 'Responsive Design', 'GitHub Pages'],
  },
  {
    slug: 'dr-karnav-patel',
    projectName: 'Dr. Karnav Patel — Clinic & Appointment Portal',
    client: 'Dr. Karnav Patel',
    industry: 'Dermatology & Medical Practice',
    liveUrl: 'https://parth-kadiya.github.io/sample-doctor-website',
    summary:
      'A comprehensive digital clinic portal for leading dermatologist Dr. Karnav Patel in Ahmedabad, featuring detailed treatment guides and streamlined appointment bookings.',
    problem:
      'Patients looking for specialized clinical and cosmetic dermatology treatments in Ahmedabad needed a trustworthy, easy-to-use digital home to explore Dr. Karnav Patel\'s expertise, review clinic locations (Apollo Hospital), and book appointments without navigating complex hospital switchboards.',
    solution:
      'Built a mobile-first clinic web portal featuring comprehensive treatment breakdowns for clinical dermatology and laser cosmetic care, verified patient testimonials, doctor background information, and an integrated appointment booking form with smooth scroll transitions.',
    results:
      'Delivered a professional, high-performance medical practice website that streamlined patient enquiry handling, enhanced practitioner credibility, and improved mobile accessibility for patients across Ahmedabad.',
    servicesProvided: ['Website Development', 'SEO Services'],
    technologiesUsed: ['HTML5', 'CSS3', 'JavaScript', 'AOS Animations', 'Responsive Mobile-First', 'Appointment Form'],
  },
];
