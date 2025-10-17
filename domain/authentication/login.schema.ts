import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export type loginDTO = z.infer<typeof loginSchema>
