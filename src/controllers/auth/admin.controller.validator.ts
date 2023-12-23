import { z } from 'zod';

export const AddUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(12),
  p1Name: z.string(),
  p2Name: z.optional(z.string()),
});

export type AddUserReqBody = z.infer<typeof AddUserSchema>;
