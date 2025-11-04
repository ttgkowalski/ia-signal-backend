import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('email').notNullable().unique()
    table.string('password_hash').notNullable()
    table.string('affiliate_id').notNullable()
    table.string('atrium_id').notNullable().unique()
    table.enum('role', ['Admin', 'Manager', 'Member']).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()

    table.index('email')
    table.index('id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
