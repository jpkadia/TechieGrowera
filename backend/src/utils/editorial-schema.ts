import { z } from 'zod';
const text = (max: number, min = 0) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .refine((value) => !/[<>\u0000]/.test(value), 'Use plain text without HTML tags.');
const slug = z
  .string()
  .min(3)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .refine(
    (value) => !['opengraph-image', 'twitter-image', 'feed', 'sitemap', 'robots'].includes(value),
    'This slug is reserved by the website.',
  );
const list = z.array(text(100, 1)).max(20);
const path = z
  .string()
  .max(500)
  .regex(/^\/(?!\/)[a-zA-Z0-9/_\-.]+$/);
export const postDraft = z
  .object({
    title: text(140, 3),
    slug,
    excerpt: text(350, 20),
    author: text(100, 2),
    authorType: z.enum(['Organization', 'Person']).optional(),
    category: text(80, 2),
    tags: list,
    featuredImage: path.default('/brand/mark.svg'),
    seoTitle: text(70, 3),
    metaDescription: text(170, 50),
    service: z.enum([
      'web-development',
      'seo',
      'graphic-design',
      'video-editing',
      'social-media-management',
      'digital-marketing',
      'meta-ads',
    ]),
    sections: z
      .array(
        z
          .object({ heading: text(160, 3), paragraphs: z.array(text(6000, 10)).min(1).max(15) })
          .strict(),
      )
      .min(1)
      .max(30),
  })
  .strict();
export const caseDraft = z
  .object({
    title: text(140, 3),
    slug,
    client: text(100, 2),
    industry: text(100, 2),
    demo: z.boolean(),
    description: text(170, 50),
    problem: text(6000, 20),
    solution: text(6000, 20),
    results: text(6000, 20),
    services: z.array(postDraft.shape.service).min(1).max(7),
    technologies: list,
    theme: z.enum(['studio', 'daily']),
  })
  .strict();
export const saveBody = (kind: string) =>
  z
    .object({
      revision: z.number().int().positive().optional(),
      draft: kind === 'blog' ? postDraft : caseDraft,
    })
    .strict();
export const revisionBody = z.object({ revision: z.number().int().positive() }).strict();
