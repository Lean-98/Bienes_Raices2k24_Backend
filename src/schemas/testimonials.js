import { z } from 'zod'

export const testimonialSchema = z.object({
  author: z
    .string()
    .max(50)
    .refine(val => val.length >= 3, {
      message: 'Author must have more than 3 characters',
    }),
  content: z.string().refine(val => val.length > 30, {
    message: 'Content must have more than 30 characters',
  }),
})
