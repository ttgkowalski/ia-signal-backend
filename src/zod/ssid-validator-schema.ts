import z from 'zod'

export const ssidValidatorSchema = z.object({
  ssid: z.string().min(1, 'SSID is required'),
})
