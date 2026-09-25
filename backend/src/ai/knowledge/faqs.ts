export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const faqsKnowledge: FAQItem[] = [
  {
    category: 'General',
    question: 'What is TechieGrowera and what do you do?',
    answer:
      'TechieGrowera is a digital growth and engineering studio. We combine modern full-stack web development, technical SEO, graphic design, video editing, social media management, and performance Meta ads to help businesses build a formidable online presence and scale sustainably.',
  },
  {
    category: 'General',
    question: 'Who founded TechieGrowera?',
    answer:
      'TechieGrowera was co-founded by Parth Kadiya (Web Developer & Technical Lead) and Kush Kadia (Digital Marketing Executive & Creative Lead).',
  },
  {
    category: 'General',
    question: 'Where is TechieGrowera located?',
    answer:
      'TechieGrowera is headquartered in Ahmedabad, Gujarat, India, and works with clients both across India and internationally.',
  },
  {
    category: 'Working Together',
    question: 'Can we start with just one specific service?',
    answer:
      'Yes, absolutely. We frequently start with a single focused deliverable—such as building a high-converting website, conducting a technical SEO audit, or producing monthly video edits—and expand into an integrated growth partnership as your business requirements evolve.',
  },
  {
    category: 'Working Together',
    question: 'How do you price projects?',
    answer:
      'Our pricing is transparent and scoped specifically to your business goals, project deliverables, and timeline. We do not push one-size-fits-all packages. After an initial discovery consultation, we provide a detailed proposal with clear milestones.',
  },
  {
    category: 'Working Together',
    question: 'How do I start a project or get in touch?',
    answer:
      'You can reach out anytime through our website contact form, email us directly at techiegrowera@gmail.com, or call/WhatsApp us at +91 90818 18478. We will schedule a free discovery call to discuss your objectives.',
  },
  {
    category: 'Guarantees & Policy',
    question: 'Do you guarantee #1 search rankings or specific lead numbers?',
    answer:
      'No honest agency can ethically guarantee first-place Google rankings or exact lead volumes, as platform algorithms and market auctions are outside direct control. What we guarantee is rigorous technical execution, adherence to industry best practices, transparent communication, and data-driven continuous optimization.',
  },
  {
    category: 'Web Development',
    question: 'Can you redesign our existing website without losing our existing SEO rankings?',
    answer:
      'Yes. When executing a redesign, we implement a comprehensive URL audit and 301 redirect map to preserve existing search equity, while simultaneously improving page speed, mobile responsiveness, and conversion architecture.',
  },
  {
    category: 'Paid Advertising',
    question: 'Is ad spend included in the Meta Ads service fee?',
    answer:
      'No. Your advertising spend is paid directly to Meta (Facebook/Instagram) from your own billing account. Our fee covers strategy, audience research, creative development, campaign setup, A/B testing, pixel/CAPI tracking, and ongoing optimization.',
  },
];
