import bcrypt from 'bcrypt'
import {
  atriumRegister,
  atriumLogin,
  atriumGetProfile,
} from '../clients/atrium.client'
import { atriumProfileSchema } from '../../domain/user'
import { sign, type SignOptions, type Secret } from 'jsonwebtoken'
import type { Role, NewUser } from '../../domain/user/user.table'
import { userRepo } from '../user/user.repo'
import { profileRepo } from '../profile/profile.repo'
import { NotFoundError } from '../errors/api-errors/not-found-error'
import { BadRequestError } from '../errors/api-errors/bad-request-error'
import { ConflictError } from '../errors'
import { InternalServerError } from '../errors'
import { registerDTO } from '../../domain/authentication/register.schema'
import { loginDTO } from '../../domain/authentication/login.schema'
import { profile } from 'console'
import { getUserData } from '../clients/check.user'

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

async function registerUser(input: registerDTO) {
  const existing = await userRepo.getUserByEmail(input.identifier)
  if (existing) throw new ConflictError('Email already exists')

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
  await profileRepo.upsertProfileByAtriumId(
    String(profileData.result.id),
    String(created.id),
    JSON.stringify(profileData)
  )

  return { atrium }
}

async function login(input: loginDTO, affiliateId: string) {
  const existing = await userRepo.getUserByEmail(input.email)
  if (!existing) {
    throw new BadRequestError('Invalid credentials')
  }

  const ok = await verifyPassword(input.password, existing.password_hash)
  if (!ok) throw new BadRequestError('Invalid credentials')

  const atrium = await atriumLogin({
    identifier: input.email,
    password: input.password,
  })
  const profile = await atriumGetProfile(atrium.ssid)
  const affId = await getUserData(atrium.user_id as string)

  if (affId != affiliateId)
    throw new BadRequestError('user does not belong to this application')

  const token = signJwt({ id: existing.id as string, role: existing.role })

  const { password_hash, ...safeUser } = existing || {}
  return { user: safeUser, token, atrium, profile }
}

export const authService = {
  registerUser,
  login,
}
