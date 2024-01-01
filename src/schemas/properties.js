import { z } from 'zod'

const propertiesSchema = z.object({
  title: z.string().max(100),
  price: z.number(),
  image: z.string().max(200),
  // image: z.string().max(200).url({
  //     message: 'Image must be a valid URL'
  // }),
  description: z.string(),
  bedrooms: z.number().int().positive().max(30),
  baths: z.number().int().positive().max(30),
  garages: z.number().int().positive().max(30),
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
