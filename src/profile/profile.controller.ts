import type { Request, Response, NextFunction } from 'express'
import { atriumGetProfile } from '../clients/atrium.client'
import { getBalanceService } from './balance-ssid.service'

async function getProfile(req: Request, res: Response, next: NextFunction) {
  const id = req.auth?.ssid
  if (!id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const result = await atriumGetProfile(id)
    return res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function getBalance(req: Request, res: Response) {
  try {
    const ssid = req.auth?.ssid

    if (!ssid) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const result = await getBalanceService(ssid)

    if (result.success) {
      res.status(200).json({
        success: true,
        data: {
          balances: result.data,
        },
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        ssid: result.ssid,
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
    })
  }
}

export const profileController = {
  getProfile,
  getBalance,
}
