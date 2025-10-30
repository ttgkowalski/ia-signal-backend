import type { Request, Response, NextFunction } from 'express'
import { authService } from './auth.service'

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('Registering user with data:', req.body)
    const result = await authService.registerUser(req.body)
    return res.status(201).json({ result })
  } catch (err) {
    next(err)
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(
      req.body,
      req.headers['x-affiliate-id'] as string
    )
    if (!result) return res.status(401).json({ error: 'Invalid credentials' })
    const { password_hash, ...safeUser } = (result.user as any) || {}
    res.json({ ...result, user: safeUser })
  } catch (err) {
    next(err)
  }
}

export const authController = {
  register,
  login,
}
