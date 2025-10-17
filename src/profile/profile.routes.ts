import { Router } from 'express'
import { requireRole } from '../middlewares/auth'
import { validateSchema } from '../middlewares/validate-schema'
import { paramsWithIdSchema } from '../../domain/utils'
import { profileController } from './profile.controller'

const profileRoutes = Router()

profileRoutes.get(
  '/:id',
  requireRole('User'),
  validateSchema({ params: paramsWithIdSchema }),
  profileController.getProfile
)
export { profileRoutes }
