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
    const result = await authService.login(req.body)
    if (!result) return res.status(401).json({ error: 'Invalid credentials' })
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const authController = {
  register,
  login,
}
