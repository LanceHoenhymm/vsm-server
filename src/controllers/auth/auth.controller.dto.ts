import { z } from 'zod';

export const registerUserDtoSchema = z.object({
  email: z.string().min(8),
  password: z.string().min(8).max(12),
  u1Name: z.string(),
  u2Name: z.optional(z.string()),
  isAdmin: z.optional(z.boolean()),
});

export type IRegisterUserDto = z.infer<typeof registerUserDtoSchema>;

export const loginUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(12),
});

export type ILoginUserDto = z.infer<typeof loginUserDtoSchema>;
