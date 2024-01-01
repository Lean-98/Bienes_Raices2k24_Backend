import { z } from 'zod'

const usersSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email().max(60),
  pword: z.string().max(60),
  role: z.string().max(60),
})

export function validateuser(objet) {
  const result = usersSchema.safeParse(objet)

  if (result.success) {
    return result.data
  } else {
    throw new Error(result.error)
  }
}
