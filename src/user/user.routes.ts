import { Router } from 'express'
import { userController } from './user.controller'
import { createUserSchema, updateUserSchema } from '../../domain/user'
import { requireRole, validateSchema } from '@/middlewares'
import { userIdValidatorSchema } from '@/zod/user-id-schema'

const userRoutes = Router()

userRoutes.post(
  '/',
  requireRole('Admin'),
  validateSchema({ body: createUserSchema }),
  userController.create
)
userRoutes.get('/', requireRole('Manager'), userController.list)
userRoutes.get(
  '/:id',
  requireRole('User'),
  validateSchema({ params: userIdValidatorSchema }),
  userController.get
)
userRoutes.patch(
  '/:id',
  requireRole('User'),
  validateSchema({ body: updateUserSchema }),
  userController.update
)
userRoutes.delete(
  '/:id',
  requireRole('User'),
  validateSchema({ params: userIdValidatorSchema }),
  userController.remove
)

export { userRoutes }
