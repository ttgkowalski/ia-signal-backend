import bcrypt from 'bcrypt'
import {
  atriumRegister,
  atriumLogin,
  atriumGetProfile,
} from '../clients/atrium.client.ts'
import { atriumProfileSchema } from '../../domain/user'
import { sign, type SignOptions, type Secret } from 'jsonwebtoken'
import type { Role, NewUser, User } from '../../domain/user/user.table'
import { userRepo } from '../user/user.repo.ts'
import { profileRepo } from '../profile/profile.repo.ts'
import { registerSchema, loginSchema } from '../../domain/authentication'
import { NotFoundError } from '../errors/api-errors/not-found-error'
import { BadRequestError } from '../errors/api-errors/bad-request-error'
import { th } from 'zod/locales'

const SALT_ROUNDS = 10

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

function signJwt(user: { id: string; role: Role }): string {
  const secret: Secret = process.env.JWT_SECRET || 'i-am-an-idiot'
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  }
  return sign({ sub: user.id, role: user.role }, secret, options)
}

async function registerUser(inputRaw: any) {
  const input = registerSchema.parse(inputRaw)

  const password_hash = await hashPassword(input.password)
  const created = await userRepo.insertUser({
    affiliate_id: input.affiliate_id,
    email: input.identifier,
    password_hash,
    role: 'User' as Role,
    created_at: new Date(),
  } as NewUser)

  const atriumBody = {
    identifier: input.identifier,
    password: input.password,
    accepted: input.accepted,
    country_id: input.country_id,
    first_name: input.first_name,
    last_name: input.last_name,
    timezone: input.timezone,
  }

  const atrium = await atriumRegister(atriumBody)

  const profileData = await atriumGetProfile(atrium.ssid as string)
  const profile = atriumProfileSchema.parse(profileData)
  await profileRepo.upsertProfileByAffiliate(
    String(created.affiliate_id),
    String(created.id),
    profile
  )

  return { atrium, user: created }
}

async function login(inputRaw: any) {
  const input = loginSchema.parse(inputRaw)
  const existing = await userRepo.getUserByEmail(input.email)
  if (!existing) throw new NotFoundError('User not found')
  if (!existing.affiliate_id)
    throw new BadRequestError('User has no affiliate ID')
  const ok = await verifyPassword(input.password, existing.password_hash)
  if (!ok) throw new BadRequestError('Invalid credentials')

  const atrium = await atriumLogin({
    identifier: input.email,
    password: input.password,
    affiliate_id: existing.affiliate_id,
  })

  const profile = await atriumGetProfile(atrium.ssid)
  // const profileData = await atriumGetProfile((atrium as any).ssid as string)
  // const profile = atriumProfileSchema.parse(profileData)
  // await profileRepo.upsertProfileByAffiliate(
  //   String(existing.affiliate_id),
  //   String(existing.id),
  //   profile
  // )

  const token = signJwt({
    id: existing.id as string,
    role: existing.role,
  })
  return { user: existing, token, atrium, profile }
}

export const authService = {
  registerUser,
  login,
}
