import { z } from 'zod'

export const createAffiliateConfigSchema = z.object({
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
  video_iframe: z.string().nullable().optional(),
  atrium_id: z.string().nullable().optional(),
})

export type CreateAffiliateConfigDTO = z.infer<
  typeof createAffiliateConfigSchema
>
