import { z } from 'zod'

export const usersSchema = z.object({
  id: z.number().int().positive({
    message: 'Id must be an integer value greater 0',
  }),
  email: z.string().email().max(60),
  pword: z
    .string()
    .max(60)
    .refine(val => val.length >= 8, {
      message: 'Password must have at least 8 characters',
    }),
  role: z
    .string()
    .max(60)
    .refine(val => val.length >= 5, {
      message: 'Role must have more than 5 characters',
    }),
})
