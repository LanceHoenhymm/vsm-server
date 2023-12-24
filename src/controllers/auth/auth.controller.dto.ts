import { z } from 'zod';

export const registerUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(12),
  p1Name: z.string(),
  p2Name: z.optional(z.string()),
});

export type IRegisterUserDto = z.infer<typeof registerUserDtoSchema>;
