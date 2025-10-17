import type { Request, Response } from 'express'
import { authService } from './auth.service.ts'

async function register(req: Request, res: Response) {
  const result = await authService.registerUser(req.body)
  const safeUser =
    result && result.user
      ? (() => {
          const { password_hash, ...rest } = (result.user as any) || {}
          return rest
        })()
      : undefined

  res.status(201).json({ ...result, user: safeUser })
}

async function login(req: Request, res: Response) {
  const result = await authService.login(req.body)
  if (!result) return res.status(401).json({ error: 'Invalid credentials' })
  const { password_hash, ...safeUser } = (result.user as any) || {}
  res.json({ ...result, user: safeUser })
}

export const authController = {
  register,
  login,
}
