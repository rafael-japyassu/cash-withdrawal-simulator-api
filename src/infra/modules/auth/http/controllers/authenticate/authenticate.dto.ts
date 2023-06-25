import { z } from 'zod';

export const authenticateSchema = z.object({
	email: z.string().email(),
	password: z.string()
});

export type AuthenticateDto = z.infer<typeof authenticateSchema>;

export type AuthenticateResponseDto = {
  token: string;
  user: {
    email: string;
    name: string;
  }
}
