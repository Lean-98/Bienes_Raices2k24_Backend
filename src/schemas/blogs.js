import { z } from 'zod'

const blogsSchema = z.object({
  title: z.string().max(100),
  // created: z.date(),
  created: z.string(),
  author: z.string().max(50),
  content: z.string(),
})

export function validateblog(objet) {
  const result = blogsSchema.safeParse(objet)

  if (result.success) {
    return result.data
  } else {
    throw new Error(result.error)
  }
}
