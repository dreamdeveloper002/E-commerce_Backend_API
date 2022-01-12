import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.enum('email_verified', [true, false]).notNullable().defaultTo(false)
      table.string('contact_number').nullable().unique()
      table.string('email').notNullable().unique()
      table.string('last_login_ip').nullable()
      table.string('token').nullable()
      table.integer('token_created_at').nullable()
      table.dateTime('last_login_date').nullable()
      table.string('email_verified_at').nullable()
      table.string('password', 180).notNullable()
      table.string('gender').notNullable()
      table.text('address').notNullable()
      table.enum('type', ['BASIC', 'ADMIN', 'SUPER_ADMIN']).notNullable().defaultTo('BASIC')
      table.enum('status', ['ACTIVE', 'INACTIVE']).notNullable().defaultTo('ACTIVE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
