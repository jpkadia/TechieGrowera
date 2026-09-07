import { z } from 'zod';
const clean = (value: string) =>
  value
    .normalize('NFKC')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
const text = (min: number, max: number) =>
  z
    .string()
    .max(max * 2)
    .transform(clean)
    .pipe(z.string().min(min).max(max));
export const contactSchema = z
  .object({
    name: text(2, 100),
    businessName: text(0, 150).default(''),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: z
      .string()
      .trim()
      .max(25)
      .regex(/^[+\d\s().-]*$/)
      .default(''),
    service: z.enum([
      'web-development',
      'seo',
      'graphic-design',
      'video-editing',
      'social-media-management',
      'digital-marketing',
      'meta-ads',
      'not-sure',
    ]),
    budget: z.enum(['under-25k', '25k-50k', '50k-100k', '100k-plus', 'discuss']),
    description: text(20, 5000),
    consent: z.literal(true),
    website: z.string().max(300).default(''),
    startedAt: z.number().int().positive(),
  })
  .strict();
