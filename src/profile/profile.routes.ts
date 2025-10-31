import { Router } from 'express'
import { requireRole } from '../middlewares/auth'
import { profileController } from './profile.controller'

import { validateSchema } from '@/middlewares'
import { ssidValidatorSchema } from '../zod/ssid-validator-schema'

const profileRoutes = Router()

profileRoutes.get(
  '/',
  requireRole('Member'),
  validateSchema({ headers: ssidValidatorSchema }),
  profileController.getProfile
)

profileRoutes.get(
  '/balance',
  requireRole('Member'),
  validateSchema({ headers: ssidValidatorSchema }),
  profileController.getBalance
)

export { profileRoutes }
