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

function signJwt(user: { id: string; role: Role; ssid: string }): string {
  const secret: Secret = process.env.JWT_SECRET || 'i-am-an-idiot'
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  }
  return sign(
    { userId: user.id, role: user.role, ssid: user.ssid },
    secret,
    options
  )
}

async function registerUser(input: registerDTO) {
  const existing = await userRepo.getUserByEmail(input.identifier)
  if (existing) throw new ConflictError('Email already exists')
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
  const password_hash = await hashPassword(input.password)
  const created = await userRepo.insertUser({
    affiliate_id: profileData.result.id,
    email: input.identifier,
    password_hash,
    role: 'User' as Role,
    created_at: new Date(),
  } as NewUser)

  await profileRepo.upsertProfileByAtriumId(
    String(profileData.result.id),
    String(created.id),
    JSON.stringify(profileData)
  )
  const token = signJwt({
    id: profileData.result.id as string,
    role: 'User',
    ssid: atrium.ssid,
  })

  return { token, affiliate_id: profileData.result.id }
}

async function login(input: loginDTO) {
  const atrium = await atriumLogin({
    identifier: input.email,
    password: input.password,
  })

  const profile = await atriumGetProfile(atrium.ssid)
  const affId = await getUserData(profile.result.id as string)
  if (!affId)
    throw new BadRequestError('user does not belong to this application')

  const token = signJwt({
    id: profile.result.id as string,
    role: 'User',
    ssid: atrium.ssid,
  })

  return { token, affiliate_id: profile.result.id }
}

export const authService = {
  registerUser,
  login,
}
