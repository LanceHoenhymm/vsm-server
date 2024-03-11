import { z } from 'zod';

export const addNewsRequestDtoSchema = z.object({
  newsData: z.array(
    z.array(z.object({ news: z.string(), forInsider: z.boolean() })),
  ),
});

export type IAddNewsRequestDto = z.infer<typeof addNewsRequestDtoSchema>;

export const addStockRequestDtoSchema = z.object({
  stockData: z.array(
    z.array(
      z.object({
        id: z.string(),
        bpc: z.coerce.number(),
        freebies: z.coerce.number().optional(),
        initialValue: z.coerce.number().optional(),
      }),
    ),
  ),
});

export type IAddStockRequestDto = z.infer<typeof addStockRequestDtoSchema>;
