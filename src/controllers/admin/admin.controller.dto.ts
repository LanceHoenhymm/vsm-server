import { z } from 'zod';

export const addNewsRequestDtoSchema = z.object({
  newsData: z.array(
    z.array(z.object({ news: z.string(), forInsider: z.boolean() })),
  ),
});

export type IAddNewsRequestDto = z.infer<typeof addNewsRequestDtoSchema>;

export const addStockRequestDtoSchema = z.object({
  stockData: z.array(
    z.object({
      roundNo: z.coerce.number(),
      stocks: z.array(
        z.object({
          id: z.string(),
          bpc: z.coerce.number(),
          maxVolTrad: z.coerce.number(),
          initialValue: z.coerce.number(),
        }),
      ),
    }),
  ),
});

export type IAddStockRequestDto = z.infer<typeof addStockRequestDtoSchema>;
