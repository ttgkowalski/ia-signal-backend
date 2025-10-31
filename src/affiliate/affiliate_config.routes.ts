import { Router } from 'express'
import { affiliateConfigController } from './affiliate_config.controller'
import { updateAffiliateConfigSchema } from '../../domain/affiliate_config'
import { validateSchema } from '../middlewares'
import { createAffiliateConfigSchema } from '../../domain/affiliate_config/create-affiliate-config-schema'

const affiliateConfigRoutes = Router()

affiliateConfigRoutes.get(
  '/',

  affiliateConfigController.getAffiliateConfig
)

affiliateConfigRoutes.patch(
  '/',

  validateSchema({ body: updateAffiliateConfigSchema }),
  affiliateConfigController.updateAffiliateConfig
)
affiliateConfigRoutes.post(
  '/',
  validateSchema({ body: createAffiliateConfigSchema }),
  affiliateConfigController.createAffiliateConfig
)

export { affiliateConfigRoutes }
