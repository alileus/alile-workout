import { z } from 'zod';
const text = z.string().trim().min(1);
export const exerciseSchema = z
  .object({
    name: text,
    equipment: text,
    volume: text,
    instructions: text,
    cue: text,
    alsoWorks: text,
  })
  .strict();
export const regionSchema = z
  .object({
    id: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: text,
    description: text,
    note: z.string(),
    references: z.array(z.url().refine((url) => url.startsWith('https://'))).min(1),
    reviewStatus: z.enum(['draft', 'reviewed']),
    exercises: z.array(exerciseSchema).min(1),
  })
  .strict();
export const groupSchema = z
  .object({
    id: text,
    name: text,
    view: z.enum(['front', 'back']),
    sections: z
      .array(z.object({ name: text, regions: z.array(regionSchema).min(1) }).strict())
      .min(1),
  })
  .strict();
export type Region = z.infer<typeof regionSchema>;
export type Group = z.infer<typeof groupSchema>;
export type Book = Group[];
