import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely'

export interface ProfileTable {
  id: Generated<string>
  affiliate_id: string
  user_id: string | null
  profile: any
  created_at: ColumnType<Date, Date | undefined, never>
  updated_at: ColumnType<Date, Date | undefined, never>
}

export type Profile = Selectable<ProfileTable>
export type NewProfile = Insertable<ProfileTable>
export type ProfileUpdate = Updateable<ProfileTable>
