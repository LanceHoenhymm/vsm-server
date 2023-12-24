import { z } from 'zod';

export const addNewsDtoSchema = z.object({
  news: z.string(),
  forInsider: z.coerce.boolean(),
  roundApplicableAt: z.coerce.number(),
});

export type IAddNewsDto = z.infer<typeof addNewsDtoSchema>;
