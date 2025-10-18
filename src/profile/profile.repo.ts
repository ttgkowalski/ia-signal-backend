import { db } from '../db.ts'
import type {
  Profile,
  NewProfile,
  ProfileUpdate,
} from '../../domain/profile/profile.table'

async function getProfileByAtriumId(
  atrium_id: string
): Promise<Profile | undefined> {
  return db
    .selectFrom('profiles')
    .selectAll()
    .where('atrium_id', '=', atrium_id)
    .executeTakeFirst()
}

async function upsertProfileByAtriumId(
  atrium_id: string,
  user_id: string | null,
  profileData: any
): Promise<Profile> {
  console.log(atrium_id, user_id, profileData)
  const existing = await getProfileByAtriumId(atrium_id)
  if (existing) {
    const updated = await db
      .updateTable('profiles')
      .set({
        profile: profileData,
        updated_at: new Date(),
      } as ProfileUpdate)
      .where('id', '=', existing.id)
      .returningAll()
      .executeTakeFirst()
    return updated!
  }

  const created = await db
    .insertInto('profiles')
    .values({ atrium_id, user_id, profile: profileData } as NewProfile)
    .returningAll()
    .executeTakeFirst()
  return created!
}

export const profileRepo = {
  getProfileByAtriumId,
  upsertProfileByAtriumId,
}
