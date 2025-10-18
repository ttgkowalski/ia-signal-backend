import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('profiles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('atrium_id').notNullable()
    table.uuid('user_id').nullable()
    table.jsonb('profile').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()

    table.unique(['atrium_id'])
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
    table.index(['atrium_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('profiles')
}
