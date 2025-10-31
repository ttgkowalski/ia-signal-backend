import { db } from '../db.js'
import type {
  AffiliateConfig,
  NewAffiliateConfig,
  AffiliateConfigUpdate,
} from '../../domain/affiliate_config/affiliate_config.table.js'

async function getAffiliateConfigByAtriumId(
  atrium_id: string
): Promise<AffiliateConfig | undefined> {
  return db
    .selectFrom('affiliate_config')
    .selectAll()
    .where('atrium_id', '=', atrium_id)
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

async function updateAffiliateConfigByAtriumId(
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
  const existing = await getAffiliateConfigByAtriumId(input.affiliate_id)
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
  getAffiliateConfigByAtriumId,
  insertAffiliateConfig,
  updateAffiliateConfigByAtriumId,
  upsertAffiliateConfig,
}
