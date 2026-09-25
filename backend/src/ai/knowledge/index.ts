import { companyKnowledge } from './company.js';
import { servicesKnowledge } from './services.js';
import { portfolioKnowledge } from './portfolio.js';
import { technologiesKnowledge } from './technologies.js';
import { faqsKnowledge } from './faqs.js';

export { companyKnowledge, servicesKnowledge, portfolioKnowledge, technologiesKnowledge, faqsKnowledge };

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Lightweight, token-efficient knowledge retriever.
 * Dynamically selects and formats relevant verified knowledge
 * based on user message and recent conversational context.
 */
export function getRelevantKnowledge(
  query: string,
  history: ChatHistoryItem[] = []
): string {
  const normalizedQuery = query.toLowerCase();
  const contextWindow = [
    ...history.slice(-2).map((h) => h.content.toLowerCase()),
    normalizedQuery,
  ].join(' ');

  const sections: string[] = [];

  // 1. Core Company Information (Always included as the primary anchor)
  sections.push(`
[COMPANY OVERVIEW]
- Brand: ${companyKnowledge.name} (${companyKnowledge.tagline})
- Summary: ${companyKnowledge.overview}
- Mission: ${companyKnowledge.mission}
- Vision: ${companyKnowledge.vision}
- Founders:
  1. ${companyKnowledge.founders[0].name} (${companyKnowledge.founders[0].role}) - ${companyKnowledge.founders[0].bio}
  2. ${companyKnowledge.founders[1].name} (${companyKnowledge.founders[1].role}) - ${companyKnowledge.founders[1].bio}
- Location: ${companyKnowledge.contact.location}
- Official Contact: Email: ${companyKnowledge.contact.email} | Phone: ${companyKnowledge.contact.primaryPhone} (Alt: ${companyKnowledge.contact.phones[1]})
- Working Hours: ${companyKnowledge.contact.workingHours}
- Consultation: ${companyKnowledge.contact.consultationMethod}
`);

  // Detect query intents
  const mentionsServices =
    contextWindow.includes('service') ||
    contextWindow.includes('offer') ||
    contextWindow.includes('web') ||
    contextWindow.includes('develop') ||
    contextWindow.includes('seo') ||
    contextWindow.includes('design') ||
    contextWindow.includes('video') ||
    contextWindow.includes('social') ||
    contextWindow.includes('media') ||
    contextWindow.includes('marketing') ||
    contextWindow.includes('ad') ||
    contextWindow.includes('meta') ||
    contextWindow.includes('startup') ||
    contextWindow.includes('price') ||
    contextWindow.includes('cost') ||
    contextWindow.includes('budget') ||
    contextWindow.includes('which one') ||
    contextWindow.includes('help');

  const mentionsPortfolio =
    contextWindow.includes('project') ||
    contextWindow.includes('portfolio') ||
    contextWindow.includes('client') ||
    contextWindow.includes('work') ||
    contextWindow.includes('case') ||
    contextWindow.includes('cartel') ||
    contextWindow.includes('doctor') ||
    contextWindow.includes('lathrix') ||
    contextWindow.includes('karnav') ||
    contextWindow.includes('demo') ||
    contextWindow.includes('example');

  const mentionsTechnologies =
    contextWindow.includes('tech') ||
    contextWindow.includes('stack') ||
    contextWindow.includes('react') ||
    contextWindow.includes('next') ||
    contextWindow.includes('node') ||
    contextWindow.includes('database') ||
    contextWindow.includes('mongo') ||
    contextWindow.includes('gemini') ||
    contextWindow.includes('ai') ||
    contextWindow.includes('language') ||
    contextWindow.includes('framework') ||
    contextWindow.includes('code');

  const mentionsContact =
    contextWindow.includes('contact') ||
    contextWindow.includes('reach') ||
    contextWindow.includes('call') ||
    contextWindow.includes('email') ||
    contextWindow.includes('phone') ||
    contextWindow.includes('hire') ||
    contextWindow.includes('talk') ||
    contextWindow.includes('where') ||
    contextWindow.includes('location') ||
    contextWindow.includes('meet') ||
    contextWindow.includes('office') ||
    contextWindow.includes('start a project');

  // 2. Services Section
  if (mentionsServices || (!mentionsPortfolio && !mentionsTechnologies && !mentionsContact)) {
    const serviceList = servicesKnowledge.map(
      (s, i) => `${i + 1}. **${s.name}**: ${s.shortDescription}
   - Details: ${s.detailedDescription}
   - Deliverables: ${s.deliverables.slice(0, 3).join(', ')}
   - Ideal For: ${s.targetAudience.join('; ')}`
    ).join('\n');

    sections.push(`
[OFFICIAL SERVICES]
TechieGrowera offers 7 core digital growth services:
${serviceList}
- Engagement Model: Projects are custom-scoped based on requirements, complexity, and milestones. We offer both single-service deliverables and full-scale growth retainers.`);
  }

  // 3. Portfolio & Client Projects Section
  if (mentionsPortfolio || (!mentionsServices && !mentionsTechnologies && !mentionsContact)) {
    const portfolioList = portfolioKnowledge.map(
      (p, i) => `${i + 1}. **${p.projectName}** (Client: ${p.client} | Industry: ${p.industry}):
   - Summary: ${p.summary}
   - Solution: ${p.solution}
   - Results: ${p.results}
   - Technologies: ${p.technologiesUsed.join(', ')}`
    ).join('\n');

    sections.push(`
[VERIFIED CLIENT PROJECTS & PORTFOLIO]
${portfolioList}`);
  }

  // 4. Technology Stack Section
  if (mentionsTechnologies) {
    const techCategories = technologiesKnowledge.categories.map(
      (cat) => `* **${cat.category}**: ${cat.technologies.join(', ')} (${cat.description})`
    ).join('\n');

    sections.push(`
[TECHNOLOGY STACK & INFRASTRUCTURE]
${technologiesKnowledge.summary}
${techCategories}`);
  }

  // 5. Contact & Consultation Section
  if (mentionsContact) {
    sections.push(`
[HOW TO CONNECT & START A PROJECT]
- Official Email: ${companyKnowledge.contact.email}
- Primary Phone / WhatsApp: ${companyKnowledge.contact.primaryPhone}
- Secondary Phone: ${companyKnowledge.contact.phones[1]}
- Physical Studio Location: ${companyKnowledge.contact.location}
- Business Working Hours: ${companyKnowledge.contact.workingHours}
- Project Workflow: Reach out via website contact form or direct phone/email. Free initial consultation to map business objectives and provide a tailored scope of work.`);
  }

  // 6. Relevant FAQs
  const matchedFaqs = faqsKnowledge.filter(
    (faq) =>
      contextWindow.includes(faq.category.toLowerCase()) ||
      faq.question.toLowerCase().split(' ').some((word) => word.length > 4 && contextWindow.includes(word))
  );

  if (matchedFaqs.length > 0) {
    const faqText = matchedFaqs
      .slice(0, 3)
      .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
      .join('\n\n');
    sections.push(`
[FREQUENTLY ASKED QUESTIONS]
${faqText}`);
  }

  return sections.join('\n\n');
}
