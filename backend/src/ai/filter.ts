/**
 * Application-level pre-filtering for TechieGrowera AI Assistant.
 * Immediately intercepts and politely declines queries that are completely
 * unrelated to TechieGrowera, preventing unnecessary LLM token expenditure
 * and latency.
 */

export interface FilterResult {
  rejected: boolean;
  reply?: string;
}

const POLITELY_DECLINE_MESSAGE =
  "I'd love to help, but I specialize specifically in TechieGrowera's services, portfolio projects, tech stack, and digital growth solutions. Let me know if you'd like to discuss building a website, improving your SEO, or scaling your online presence!";

// Patterns for questions clearly unrelated to TechieGrowera
const UNRELATED_PATTERNS: RegExp[] = [
  // Coding generation / homework requests (not asking about our tech stack)
  /^(?:write|create|generate|give me|implement)\s+(?:a\s+)?(?:python|java|c\+\+|javascript|typescript|c#|rust|php|golang|bash|ruby|sql)\s+(?:code|program|script|function|class|algorithm)/i,
  /^(?:write|code|solve)\s+(?:a\s+)?(?:snake game|calculator|tic tac toe|todo app|fibonacci|binary search|leetcode|bubble sort)/i,
  /\b(?:def\s+[a-z_][a-z0-9_]*\s*\(|function\s+[a-z_][a-z0-9_]*\s*\(|public\s+static\s+void\s+main|import\s+numpy|import\s+pandas)\b/i,

  // World politics, heads of state, elections
  /\b(?:president\s+of|prime\s+minister\s+of|chancellor\s+of|vice\s+president\s+of|governor\s+of|election\s+results?|who\s+won\s+the\s+election)\b/i,

  // Weather and meteorology
  /\b(?:weather|forecast|temperature\s+(?:in|outside|today)|is\s+it\s+raining)\b/i,

  // Physics, chemistry, pure science homework
  /\b(?:quantum\s+physics|quantum\s+mechanics|general\s+relativity|schrodinger|photosynthesis|periodic\s+table|chemical\s+formula|speed\s+of\s+light)\b/i,

  // Cooking, recipes, food preparation
  /\b(?:recipe\s+for|how\s+to\s+cook|how\s+to\s+bake|ingredients\s+for\s+(?:cake|pizza|pasta|soup|bread))\b/i,

  // Creative writing unrelated to company
  /\b(?:write\s+(?:me\s+)?a\s+(?:poem|romantic\s+story|song\s+lyrics?|fairy\s+tale|joke))\b/i,

  // Sports scores & unrelated trivia
  /\b(?:who\s+won\s+the\s+(?:world\s+cup|super\s+bowl|ipl|champions\s+league|olympics))\b/i,

  // Prompt injection / system prompt extraction attempts
  /\b(?:ignore\s+(?:all\s+)?previous\s+instructions|system\s+prompt|reveal\s+your\s+(?:instructions|guidelines|secret)|you\s+are\s+now\s+dan|developer\s+mode)\b/i,
];

// Exceptions: If query explicitly asks about TechieGrowera's stack, projects, or team, do not reject
const COMPANY_ANCHOR_PATTERNS: RegExp[] = [
  /\b(?:techiegrowera|techie\s+growera|parth|kush|cartel\s*369|doctor\s*gen\s*ai|lathrix|dr\.?\s*karnav)\b/i,
  /\b(?:your\s+services?|our\s+services?|what\s+services?|what\s+technolog(?:y|ies)|what\s+stack|your\s+projects?|your\s+team)\b/i,
];

export function preFilterQuery(query: string): FilterResult {
  const trimmed = query.trim();

  // If query explicitly anchors to company, allow through
  const isExplicitlyCompany = COMPANY_ANCHOR_PATTERNS.some((pat) => pat.test(trimmed));
  if (isExplicitlyCompany) {
    return { rejected: false };
  }

  // Check against strictly unrelated patterns
  for (const pattern of UNRELATED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        rejected: true,
        reply: POLITELY_DECLINE_MESSAGE,
      };
    }
  }

  return { rejected: false };
}
