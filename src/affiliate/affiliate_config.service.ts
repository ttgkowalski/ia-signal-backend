import { affiliateConfigRepo } from '../affiliate/affiliate_config.repo'
import type { UpdateAffiliateConfigDTO } from '../../domain/affiliate_config'
import { NotFoundError } from '../errors/api-errors/not-found-error'
import { convertImagePathsToUrls } from '../lib/image-url.service'

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

export const affiliateConfigService = {
  getAffiliateConfig,
  updateAffiliateConfig,
}
