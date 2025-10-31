import { Router } from 'express'
import { affiliateConfigController } from './affiliate_config.controller'
import { updateAffiliateConfigSchema } from '../../domain/affiliate_config'
import { validateSchema, requireRole } from '../middlewares'
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

const affiliateRoutes = Router()

affiliateRoutes.get(
  '/members',
  requireRole('Affiliate'),
  affiliateConfigController.getAffiliateMembers
)

export { affiliateRoutes }