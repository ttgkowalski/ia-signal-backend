import type {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from 'kysely'

export type Role = "Admin" | "Affiliate" | "Member"

export interface UserTable {
    id: Generated<string>
    affiliate_id: string | null
    email: string
    password_hash: string
    role: Role
    created_at: ColumnType<Date, Date | undefined, never>
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>
