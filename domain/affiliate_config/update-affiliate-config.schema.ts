import { z } from 'zod'

export const updateAffiliateConfigSchema = z.object({
  logo_url: z.string().nullable().optional(),
  icon_url: z.string().nullable().optional(),
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
  video_iframe: z.string().nullable().optional(),
  atrium_affiliate_id: z.string().nullable().optional(),
})

export type UpdateAffiliateConfigDTO = z.infer<typeof updateAffiliateConfigSchema>

