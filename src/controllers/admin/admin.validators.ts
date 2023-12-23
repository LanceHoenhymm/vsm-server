import { z } from 'zod';

export const AddUserSchema = z.object({
  teamName: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, 'The Name must be AlphaNumeric')
    .min(5),
  password: z.string().min(8).max(12),
  p1Name: z.string(),
  p2Name: z.optional(z.string()),
});

export type AddUserReqBody = z.infer<typeof AddUserSchema>;
