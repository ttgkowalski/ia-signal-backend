import { z } from 'zod'

export const atriumProfileSchema = z.object({
  id: z.number().optional(),
  identifier: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  country_id: z.number().optional(),
  timezone: z.string().optional(),
  status: z.string().optional(),
  verified: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),

  avatar: z.string().optional(),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
})

export type AtriumProfile = z.infer<typeof atriumProfileSchema>
