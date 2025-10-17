import { db } from '../db.ts'
import type {
  Profile,
  NewProfile,
  ProfileUpdate,
} from '../../domain/profile/profile.table'

async function getProfileByAffiliate(
  affiliate_id: string
): Promise<Profile | undefined> {
  return db
    .selectFrom('profiles')
    .selectAll()
    .where('affiliate_id', '=', affiliate_id)
    .executeTakeFirst()
}

async function upsertProfileByAffiliate(
  affiliate_id: string,
  user_id: string | null,
  profileData: any
): Promise<Profile> {
  const existing = await getProfileByAffiliate(affiliate_id)
  if (existing) {
    const updated = await db
      .updateTable('profiles')
      .set({
        profile: profileData,
        user_id,
        updated_at: new Date(),
      } as ProfileUpdate)
      .where('id', '=', existing.id)
      .returningAll()
      .executeTakeFirst()
    return updated!
  }

  const created = await db
    .insertInto('profiles')
    .values({ affiliate_id, user_id, profile: profileData } as NewProfile)
    .returningAll()
    .executeTakeFirst()
  return created!
}

export const profileRepo = {
  getProfileByAffiliate,
  upsertProfileByAffiliate,
}
