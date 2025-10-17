import { Request, Response } from 'express'
import { atriumGetProfile } from '../clients/atrium.client'

async function getProfile(req: Request, res: Response) {
  const { id } = req.params

  try {
    const result = await atriumGetProfile(id)

    return res.status(200).json(result)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return res.status(404).json({ error: 'Profile not found' })
  }
}

export const profileController = {
  getProfile,
}
