import { z } from 'zod'

const acceptedItem = z.enum(['terms', 'privacy policy'])

export const registerSchema = z.object({
  affiliate_id: z.string().min(1, 'affiliate_id is required'),

  identifier: z.email(),
  password: z.string().min(8),
  accepted: z
    .array(acceptedItem)
    .refine((arr) => arr.includes('terms') && arr.includes('privacy policy'), {
      message: "accepted must include 'terms' and 'privacy policy'",
    }),
  country_id: z.number().int().positive(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  timezone: z.string().min(1),
})
