import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('tenant_id').nullable()
    table.string('email').notNullable().unique()
    table.string('password_hash').notNullable()
    table.enum('role', ['Admin', 'Manager', 'User']).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()

    table
      .foreign('tenant_id')
      .references('id')
      .inTable('tenants')
      .onDelete('SET NULL')

    table.index('email')
    table.index('tenant_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
