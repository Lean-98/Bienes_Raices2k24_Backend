import { z } from 'zod'

const vendorsSchema = z.object({
  name: z.string().max(50),
  surname: z.string().max(50),
  phone: z.string().max(14),
  email: z.string().email().max(50),
  image: z.string().max(200),
  // image: z.string().max(200).url({
  //     message: 'Image must be a valid URL'
  // }),
})

export function validatevendor(objet) {
  const result = vendorsSchema.safeParse(objet)

  if (result.success) {
    return result.data
  } else {
    throw new Error(result.error)
  }
}
