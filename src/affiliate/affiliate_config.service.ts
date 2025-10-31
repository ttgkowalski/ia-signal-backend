import { affiliateConfigRepo } from '../affiliate/affiliate_config.repo'
import type { UpdateAffiliateConfigDTO } from '../../domain/affiliate_config'
import { NotFoundError } from '../errors/api-errors/not-found-error'
import { convertImagePathsToUrls } from '../lib/image-url.service'
import { ConflictError } from '@/errors'
import { CreateAffiliateConfigDTO } from '../../domain/affiliate_config/create-affiliate-config-schema'
import { userService } from '../user/user.service'

async function getAffiliateConfig(affiliate_id: string) {
  const config = await affiliateConfigRepo.getAffiliateConfigByAffiliateId(
    affiliate_id
  )
  if (!config) {
    throw new NotFoundError('Affiliate config')
  }

  const { logo_url, icon_url } = await convertImagePathsToUrls({
    logo_url: config.logo_url,
    icon_url: config.icon_url,
  })

  return {
    ...config,
    logo_url,
    icon_url,
  }
}
async function createAffiliateConfig(
  input: CreateAffiliateConfigDTO,
  affiliate_id: string
) {
  const existing = await affiliateConfigRepo.getAffiliateConfigByAffiliateId(
    affiliate_id
  )
  if (existing) {
    throw new ConflictError(
      'Affiliate config already exists for this affiliate_id'
    )
  }

  const created = await affiliateConfigRepo.insertAffiliateConfig({
    affiliate_id: affiliate_id,
    logo_url: input.logo_url ?? null,
    icon_url: input.icon_url ?? null,
    primary_color: input.primary_color ?? '#000000',
    secondary_color: input.secondary_color ?? '#FFFFFF',
    video_iframe: input.video_iframe ?? null,
    atrium_affiliate_id: input.atrium_affiliate_id ?? null,
  })

  // Converter paths de imagens para URLs
  const { logo_url, icon_url } = await convertImagePathsToUrls({
    logo_url: created.logo_url,
    icon_url: created.icon_url,
  })

  return {
    ...created,
    logo_url,
    icon_url,
  }
}
async function updateAffiliateConfig(
  affiliate_id: string,
  input: UpdateAffiliateConfigDTO
) {
  const existing = await affiliateConfigRepo.getAffiliateConfigByAffiliateId(
    affiliate_id
  )
  if (!existing) {
    throw new NotFoundError('Affiliate config')
  }

  const updated = await affiliateConfigRepo.updateAffiliateConfigByAffiliateId(
    affiliate_id,
    input
  )

  if (!updated) {
    throw new NotFoundError('Affiliate config')
  }

  const { logo_url, icon_url } = await convertImagePathsToUrls({
    logo_url: updated.logo_url,
    icon_url: updated.icon_url,
  })

  return {
    ...updated,
    logo_url,
    icon_url,
  }
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
