import type { Request, Response, NextFunction } from 'express'
import { atriumGetProfile } from '../clients/atrium.client'

async function getProfile(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params
  try {
    const result = await atriumGetProfile(id)
    return res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const profileController = {
  getProfile,
}
