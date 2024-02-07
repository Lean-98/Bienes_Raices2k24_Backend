import { z } from 'zod'

export const blogsSchema = z.object({
  title: z
    .string()
    .max(100)
    .refine(val => val.length > 10, {
      message: 'Title must have more than 10 characters',
    }),
  created: z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/, {
    message: 'Expected date format: YYYY/MM/DD',
  }),
  author: z
    .string()
    .max(50)
    .refine(val => val.length >= 3, {
      message: 'Author must have more than 3 characters',
    }),
  content: z.string().refine(val => val.length > 50, {
    message: 'Content must have more than 50 characters',
  }),
})
