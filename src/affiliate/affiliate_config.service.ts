import { affiliateConfigRepo } from '../affiliate/affiliate_config.repo'
import type { UpdateAffiliateConfigDTO } from '../../domain/affiliate_config'
import { NotFoundError } from '../errors/api-errors/not-found-error'
import { convertImagePathsToUrls } from '../lib/image-url.service'
import { ConflictError } from '@/errors'
import { CreateAffiliateConfigDTO } from '../../domain/affiliate_config/create-affiliate-config-schema'
import { userService } from '../user/user.service'
import { getPresignedUrl, MINIO_BUCKET, uploadMinIO } from '../lib/minio'
declare const Buffer: any
import { v4 as uuidv4 } from 'uuid'

export async function getAffiliateConfig(atrium_id: string) {
  const config = await affiliateConfigRepo.getAffiliateConfigByAtriumId(
    atrium_id
  )
  if (!config) {
    throw new NotFoundError('Affiliate config')
  }

  let logo_url: string | null = null
  let icon_url: string | null = null

  if (config.logo_url) {
    const objectName = config.logo_url.split('/').pop()!
    logo_url = await getPresignedUrl(objectName)
  }

  if (config.icon_url) {
    const objectName = config.icon_url.split('/').pop()!
    icon_url = await getPresignedUrl(objectName)
  }

  return {
    ...config,
    logo_url,
    icon_url,
  }
}
export async function createAffiliateConfig(
  input: CreateAffiliateConfigDTO,
  affiliate_id: string
) {
  const existing = await affiliateConfigRepo.getAffiliateConfigByAtriumId(
    affiliate_id
  )
  if (existing) {
    throw new ConflictError(
      'Affiliate config already exists for this affiliate_id'
    )
  }

  console.log('Recebendo arquivos do frontend...')

  const { logo_file, icon_file } = input as any

  let logoUrl: string | null = null
  let iconUrl: string | null = null

  if (logo_file) {
    const ext = logo_file.originalname.split('.').pop()
    const uniqueLogoName = `affiliate/${affiliate_id}/logo-${uuidv4()}.${ext}`
    logoUrl = await uploadMinIO(
      uniqueLogoName,
      logo_file.buffer,
      logo_file.mimetype
    )
  }

  if (icon_file) {
    const ext = icon_file.originalname.split('.').pop()
    const uniqueIconName = `affiliate/${affiliate_id}/icon-${uuidv4()}.${ext}`
    iconUrl = await uploadMinIO(
      uniqueIconName,
      icon_file.buffer,
      icon_file.mimetype
    )
  }

  console.log({ logoUrl }, { iconUrl })

  const created = await affiliateConfigRepo.insertAffiliateConfig({
    affiliate_id,
    logo_url: logoUrl,
    icon_url: iconUrl,
    primary_color: input.primary_color ?? '#000000',
    secondary_color: input.secondary_color ?? '#FFFFFF',
    video_iframe: input.video_iframe ?? null,
    atrium_id: input.atrium_id ?? null,
  })

  return created
}

export async function updateAffiliateConfig(
  atrium_id: string,
  input: UpdateAffiliateConfigDTO
) {
  const existing = await affiliateConfigRepo.getAffiliateConfigByAtriumId(
    atrium_id
  )
  if (!existing) {
    throw new NotFoundError('Affiliate config')
  }

  console.log('Recebendo arquivos para update...')

  const { logo_file, icon_file } = input as any

  const updates: any = { ...input }

  if (logo_file) {
    const ext = logo_file.originalname.split('.').pop()
    const uniqueLogoName = `affiliate/${atrium_id}/logo-${uuidv4()}.${ext}`
    updates.logo_url = await uploadMinIO(
      uniqueLogoName,
      logo_file.buffer,
      logo_file.mimetype
    )
  }

  if (icon_file) {
    const ext = icon_file.originalname.split('.').pop()
    const uniqueIconName = `affiliate/${atrium_id}/icon-${uuidv4()}.${ext}`
    updates.icon_url = await uploadMinIO(
      uniqueIconName,
      icon_file.buffer,
      icon_file.mimetype
    )
  }

  const updated = await affiliateConfigRepo.updateAffiliateConfigByAtriumId(
    atrium_id,
    updates
  )

  if (!updated) {
    throw new NotFoundError('Affiliate config')
  }

  return updated
}

async function getAffiliateMembers(affiliate_id: string) {
  return await userService.getMembersByAffiliateId(affiliate_id)
}

export const affiliateConfigService = {
  getAffiliateConfig,
  createAffiliateConfig,
  updateAffiliateConfig,
  getAffiliateMembers,
}

function decodeBase64Image(input: string): {
  buffer: any
  contentType: string
  ext: string
} {
  const dataUrlMatch = input.match(/^data:(.?);base64,(.)$/)
  let mime = 'image/png'
  let base64 = input
  if (dataUrlMatch) {
    mime = dataUrlMatch[1] || mime
    base64 = dataUrlMatch[2]
  }
  const buffer = Buffer.from(base64, 'base64')
  const ext = mime.split('/')[1] || 'png'
  return { buffer, contentType: mime, ext }
}
