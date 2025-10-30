import { Router } from 'express'

import {
  loginHeadersSchema,
  loginSchema,
  registerSchema,
} from '../../domain/authentication/'
import { validateSchema } from '@/middlewares'
import { authController } from './auth.controller'

const authRoutes = Router()

authRoutes.post(
  '/register',
  validateSchema({ body: registerSchema }),
  authController.register
)
authRoutes.post(
  '/login',
  validateSchema({ body: loginSchema, headers: loginHeadersSchema }),
  authController.login
)

export { authRoutes }
