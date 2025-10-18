import { userRepo } from './user.repo'
import type {
  User,
  NewUser,
  UserUpdate,
  Role,
} from '../../domain/user/user.table'
import { hash } from 'bcrypt'
import { NotFoundError, ConflictError } from '../errors'

type CreateUserInput = {
  affiliate_id?: string | null
  email: string
  password: string
  role?: Role
  created_at?: Date
}

async function create(input: CreateUserInput): Promise<User> {
  const existing = await userRepo.getUserByEmail(input.email)
  if (existing) {
    throw new ConflictError('Email already exists')
  }

  const password_hash = await hash(input.password, 10)

  const newUser: NewUser = {
    affiliate_id: input.affiliate_id ?? null,
    email: input.email,
    password_hash,
    role: input.role ?? ('User' as Role),
    created_at: input.created_at,
  } as NewUser

  const created = await userRepo.insertUser(newUser)

  return created
}

async function list(): Promise<User[]> {
  return await userRepo.listUsers()
}

async function get(id: string): Promise<User> {
  const user = await userRepo.getUser(id)
  if (!user) throw new NotFoundError('User')
  return user
}

async function update(id: string, input: Partial<UserUpdate>): Promise<User> {
  if (input.email) {
    const byEmail = await userRepo.getUserByEmail(input.email)
    if (byEmail && byEmail.id !== id) {
      throw new ConflictError('Email already exists')
    }
  }

  const updateData: any = { ...input }
  if (input.password_hash) {
    updateData.password_hash = await hash(input.password_hash, 10)
    delete updateData.password
  }

  if (input.affiliate_id !== undefined) {
    updateData.affiliate_id = input.affiliate_id
  }

  const updated = await userRepo.updateUser(id, updateData as UserUpdate)
  if (!updated) throw new NotFoundError('User')
  return updated
}

async function remove(id: string): Promise<void> {
  const existing = await userRepo.getUser(id)
  if (!existing) throw new NotFoundError('User')
  await userRepo.deleteUser(id)
}

export const userService = {
  create,
  list,
  get,
  update,
  remove,
}
