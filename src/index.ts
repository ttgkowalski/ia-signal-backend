import express, { Router } from 'express'
import { GlobalErrorHandler } from './middlewares/global-error-handler'
import { BadRequestError, NotFoundError } from './errors/api-errors'

import { attachAuth } from './middlewares'
import { authRoutes } from './auth/auth.routes'
import { profileRoutes } from './profile/profile.routes'
import { userRoutes } from './user/user.routes'
import { affiliateConfigRoutes } from './affiliate/affiliate_config.routes'
const app = express()
app.use(express.json())

app.use(attachAuth)

const router = Router()

router.use('/auth', authRoutes)
router.use('/profile', profileRoutes)
router.use('/users', userRoutes)
router.use('/affiliate-config', affiliateConfigRoutes)
router.get('/:id', (req, res) => {
  const { id } = req.params

  if (id === '0') {
    throw new BadRequestError('ID inválido')
  }

  if (id === '999') {
    throw new NotFoundError('User')
  }

  res.json({ id, name: 'Alice' })
})

router.get('/ping', (req, res) => {
  res.send('Pong')
})

app.use(router)

app.use(GlobalErrorHandler)
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000')
})
