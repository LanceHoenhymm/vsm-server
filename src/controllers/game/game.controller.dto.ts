import { z } from 'zod';

export const stockBuySellDtoSchema = z.object({
  stock: z.string(),
  amount: z.number(),
});

export type IBuySellDto = z.infer<typeof stockBuySellDtoSchema>;
