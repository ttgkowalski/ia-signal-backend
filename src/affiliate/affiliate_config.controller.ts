import type { Request, Response, NextFunction } from 'express'
import { affiliateConfigService } from './affiliate_config.service'

async function getAffiliateConfig(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const affiliate_id = req.headers['x-affiliate-id'] as string
    if (!affiliate_id) {
      return res.status(400).json({ error: 'affiliate_id is required' })
    }

    const result = await affiliateConfigService.getAffiliateConfig(affiliate_id)
    return res.json({ result })
  } catch (err) {
    next(err)
  }
}

async function updateAffiliateConfig(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const affiliate_id = req.headers['x-affiliate-id'] as string
    if (!affiliate_id) {
      return res.status(400).json({ error: 'affiliate_id is required' })
    }

    const result = await affiliateConfigService.updateAffiliateConfig(
      affiliate_id,
      req.body
    )
    return res.json({ result })
  } catch (err) {
    next(err)
  }
}

export const affiliateConfigController = {
  getAffiliateConfig,
  updateAffiliateConfig,
}
