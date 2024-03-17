import { z } from 'zod';

export const addNewsRequestDtoSchema = z.array(
  z.object({
    content: z.string(),
    forInsider: z.boolean(),
    roundApplicable: z.coerce.number(),
  }),
);

export type IAddNewsRequestDto = z.infer<typeof addNewsRequestDtoSchema>;

export const addStockRequestDtoSchema = z.array(
  z.object({
    symbol: z.string(),
    volatility: z.coerce.number(),
    freebies: z.coerce.number(),
    price: z.coerce.number(),
    roundIntorduced: z.coerce.number(),
  }),
);

export type IAddStockRequestDto = z.infer<typeof addStockRequestDtoSchema>;
