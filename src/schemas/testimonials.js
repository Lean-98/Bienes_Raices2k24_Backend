import { z } from 'zod'

const testimonialSchema = z.object({
  author: z.string().max(50),
  content: z.string(),
})

export function validateTestimonial(objet) {
  const result = testimonialSchema.safeParse(objet)

  if (result.success) {
    return result.data
  } else {
    throw new Error(result.error)
  }
}
