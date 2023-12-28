import { z } from 'zod';

export const registerUserDtoSchema = z.object({
  teamId: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/)
    .min(5)
    .max(10),
  email: z.string().email(),
  password: z.string().min(8).max(12),
  p1Name: z.string(),
  p2Name: z.optional(z.string()),
});

export type IRegisterUserDto = z.infer<typeof registerUserDtoSchema>;

export const loginUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(12),
});

export type ILoginUserDto = z.infer<typeof loginUserDtoSchema>;
