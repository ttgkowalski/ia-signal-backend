import { z } from 'zod'

export const createUserSchema = z.object({
  affiliate_id: z.string().nullable().optional(),
  email: z.email(),
  password: z.string().min(1),
  role: z.enum(['User']).default('User'),
  created_at: z
    .preprocess(
      (v) => (typeof v === 'string' || v instanceof Date ? new Date(v) : v),
      z.date()
    )
    .optional(),
})
