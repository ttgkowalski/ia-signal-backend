import { Router } from 'express'
import { affiliateConfigController } from './affiliate_config.controller'
import { updateAffiliateConfigSchema } from '../../domain/affiliate_config'
import { validateSchema } from '../middlewares'

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

  validateSchema({ body: updateAffiliateConfigSchema }),
  affiliateConfigController.updateAffiliateConfig
)

export { affiliateConfigRoutes }
