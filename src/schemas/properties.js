import { z } from 'zod'

export const propertySchema = z.object({
  title: z
    .string()
    .max(100)
    .refine(val => val.length > 15, {
      message: 'Description must have more than 15 characters',
    }),
  price: z
    .string()
    .refine(val => !isNaN(Number(val)) && Number(val) >= 1000, {
      message:
        'Number for price must be integer and greater than or equal to 1000 usd',
    })
    .transform(val => Number(val)),
  description: z.string().refine(val => val.length > 50, {
    message: 'Description must have more than 50 characters',
  }),
  bedrooms: z
    .string()
    .refine(
      val => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 30,
      {
        message:
          'The number of bedrooms must be integer and cannot be more than 30',
      },
    )
    .transform(val => Number(val)),
  baths: z
    .string()
    .refine(
      val => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 30,
      {
        message:
          'The number of baths must be integer and cannot be more than 30',
      },
    )
    .transform(val => Number(val)),
  garage: z
    .string()
    .refine(
      val => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 30,
      {
        message:
          'The number of garages must be integer and cannot be more than 30',
      },
    )
    .transform(val => Number(val)),
  created: z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/, {
    message: 'Expected date format: YYYY/MM/DD',
  }),
  vendor_id: z.string().uuid(),
})
