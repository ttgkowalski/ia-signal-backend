import { db } from '../db.js'
import type {
  AffiliateConfig,
  NewAffiliateConfig,
  AffiliateConfigUpdate,
} from '../../domain/affiliate_config/affiliate_config.table.js'

async function getAffiliateConfigByAffiliateId(
  affiliate_id: string
): Promise<AffiliateConfig | undefined> {
  return db
    .selectFrom('affiliate_config')
    .selectAll()
    .where('affiliate_id', '=', affiliate_id)
    .executeTakeFirst()
}

async function insertAffiliateConfig(
  input: NewAffiliateConfig
): Promise<AffiliateConfig> {
  const row = await db
    .insertInto('affiliate_config')
    .values(input)
    .returningAll()
    .executeTakeFirst()
  return row!
}

async function updateAffiliateConfigByAffiliateId(
  affiliate_id: string,
  input: AffiliateConfigUpdate
): Promise<AffiliateConfig | null> {
  const updated = await db
    .updateTable('affiliate_config')
    .set({
      ...input,
    })
    .where('affiliate_id', '=', affiliate_id)
    .returningAll()
    .executeTakeFirst()
  return updated ?? null
}

async function upsertAffiliateConfig(
  input: NewAffiliateConfig
): Promise<AffiliateConfig> {
  const existing = await getAffiliateConfigByAffiliateId(input.affiliate_id)
  if (existing) {
    const updated = await db
      .updateTable('affiliate_config')
      .set({
        ...input,
        updated_at: new Date(),
      } as AffiliateConfigUpdate)
      .where('id', '=', existing.id)
      .returningAll()
      .executeTakeFirst()
    return updated!
  }

  const created = await db
    .insertInto('affiliate_config')
    .values(input)
    .returningAll()
    .executeTakeFirst()
  return created!
}

export const affiliateConfigRepo = {
  getAffiliateConfigByAffiliateId,
  insertAffiliateConfig,
  updateAffiliateConfigByAffiliateId,
  upsertAffiliateConfig,
}
