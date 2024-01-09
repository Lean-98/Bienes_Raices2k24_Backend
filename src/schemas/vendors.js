import { z } from 'zod'

export const vendorsSchema = z.object({
  name: z
    .string()
    .max(50)
    .refine(val => val.length >= 3, {
      message: 'Name must have more than 3 characters',
    }),
  surname: z
    .string()
    .max(50)
    .refine(val => val.length >= 3, {
      message: 'Surname must have more than 3 characters',
    }),
  phone: z
    .string()
    .max(14)
    .refine(val => !isNaN(Number(val)) && Number(val) >= 10, {
      message: 'Phone number must be 10 characters long',
    })
    .transform(val => Number(val)),
  email: z.string().email().max(50),
})
