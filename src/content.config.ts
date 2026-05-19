import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    category: z.string(),
    accent: z.enum(['purple', 'red', 'blue']),
    metric: z.string().optional(),
    metricLabel: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = { cases };
