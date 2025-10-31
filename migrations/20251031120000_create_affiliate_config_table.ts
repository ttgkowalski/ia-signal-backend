import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('affiliate_config', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('affiliate_id').notNullable()
    table.string('atrium_id').notNullable().unique()
    table.text('logo_url').nullable()
    table.text('icon_url').nullable()
    table.text('primary_color').defaultTo('#000000').notNullable()
    table.text('secondary_color').defaultTo('#FFFFFF').notNullable()
    table.text('video_iframe').nullable()
    table.string('atrium_id').nullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()

    table.index('affiliate_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('affiliate_config')
}
