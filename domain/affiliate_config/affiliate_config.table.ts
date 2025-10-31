import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely'

export interface AffiliateConfigTable {
  id: Generated<string>
  affiliate_id: string
  logo_url: string | null
  icon_url: string | null
  primary_color: string
  secondary_color: string
  video_iframe: string | null
  atrium_id: string | null
  created_at: ColumnType<Date, Date | undefined, never>
  updated_at: ColumnType<Date, Date | undefined, never>
}

export type AffiliateConfig = Selectable<AffiliateConfigTable>
export type NewAffiliateConfig = Insertable<AffiliateConfigTable>
export type AffiliateConfigUpdate = Updateable<AffiliateConfigTable>
