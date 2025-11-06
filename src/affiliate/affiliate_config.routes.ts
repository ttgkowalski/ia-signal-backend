import { Router, type IRouter } from 'express'
import { affiliateConfigController } from './affiliate_config.controller'
import { updateAffiliateConfigSchema } from '../../domain/affiliate_config'
import { validateSchema, requireRole } from '../middlewares'
import { createAffiliateConfigSchema } from '../../domain/affiliate_config/create-affiliate-config-schema'
import { multerConfig } from '../../multer-config'

const affiliateConfigRoutes: IRouter = Router()

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
  multerConfig.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
  ]),
  validateSchema({ body: createAffiliateConfigSchema }),
  affiliateConfigController.createAffiliateConfig
)

export { affiliateConfigRoutes }

const affiliateRoutes: IRouter = Router()

affiliateRoutes.get(
  '/members',
  requireRole('Affiliate'),
  affiliateConfigController.getAffiliateMembers
)

export { affiliateRoutes }
