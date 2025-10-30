import z from 'zod'

export const userIdValidatorSchema = z.object({
  id: z.string().min(1, 'ID is required'),
})
