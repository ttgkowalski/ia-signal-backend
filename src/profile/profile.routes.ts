import { Router } from 'express'
import { requireRole } from '../middlewares/auth'
import { profileController } from './profile.controller'

const profileRoutes = Router()

profileRoutes.get('/', requireRole('User'), profileController.getProfile)

export { profileRoutes }
