import { z } from 'zod'

const propertiesSchema = z.object({
  title: z.string().max(100),
  price: z
    .string()
    .refine(val => !isNaN(Number(val)), { message: 'Invalid number' })
    .transform(val => Number(val)),
  description: z.string(),
  bedrooms: z
    .string()
    .refine(val => !isNaN(Number(val)), { message: 'Invalid number' })
    .transform(val => Number(val)),
  baths: z
    .string()
    .refine(val => !isNaN(Number(val)), { message: 'Invalid number' })
    .transform(val => Number(val)),
  garage: z
    .string()
    .refine(val => !isNaN(Number(val)), { message: 'Invalid number' })
    .transform(val => Number(val)),
  created: z.string(),
  vendor_id: z.string().uuid(),
})

export function validateproperty(objet) {
  const result = propertiesSchema.safeParse(objet)

  if (result.success) {
    return result.data
  } else {
    throw new Error(result.error)
  }
}
