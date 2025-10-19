import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const loginHeadersSchema = z.object({
  'x-affiliate-id': z.string().min(1, 'O header x-affiliate-id é obrigatório'),
})
export type loginDTO = z.infer<typeof loginSchema>
