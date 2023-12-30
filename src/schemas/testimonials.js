import z from 'zod'

const testimonialSchema = z.object({
  nombreCompleto: z.string({
    required_error: 'Fullname is required.',
  }),
  contenido: {
    type: z.string(),
  },
})

export function validateTestimonial(object) {
  return testimonialSchema.safeParse(object)
}
