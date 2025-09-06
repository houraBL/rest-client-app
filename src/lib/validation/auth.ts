import z from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email({ message: 'Please enter a valid email (example@gmail.com)' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/(?=.*\p{L})/u, {
      message: 'Password must contain at least one letter',
    })
    .regex(/(?=.*\d)/, { message: 'Password must contain at least one number' })
    .regex(/(?=.*[^\p{L}\d\s])/u, {
      message: 'Password must contain at least one special character',
    }),
});

export const loginSchema = z.object({
  email: z.email({ message: 'Please enter a valid email (example@gmail.com)' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});
