import { z } from 'zod';

export const loginUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(12),
});

export type ILoginUserDto = z.infer<typeof loginUserDtoSchema>;
