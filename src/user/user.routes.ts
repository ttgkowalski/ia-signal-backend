import { Router, type IRouter } from 'express'
import { userController } from './user.controller'
import { createUserSchema, updateUserSchema } from '../../domain/user'
import { requireRole, validateSchema } from '../middlewares'
import { userIdValidatorSchema } from '../zod/user-id-schema'

const userRoutes: IRouter = Router()

userRoutes.post(
  '/',
  requireRole('Admin'),
  validateSchema({ body: createUserSchema }),
  userController.create
)
userRoutes.get('/', requireRole('Affiliate'), userController.list)
userRoutes.get(
  '/:id',
  requireRole('Member'),
  validateSchema({ params: userIdValidatorSchema }),
  userController.get
)
userRoutes.patch(
  '/:id',
  requireRole('Member'),
  validateSchema({ body: updateUserSchema }),
  userController.update
)
userRoutes.delete(
  '/:id',
  requireRole('Member'),
  validateSchema({ params: userIdValidatorSchema }),
  userController.remove
)

export { userRoutes }
