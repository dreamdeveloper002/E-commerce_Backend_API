import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 250).notNullable()
      table.string('address').notNullable()
      table.text('description').notNullable()
      table.integer('user_id').notNullable()
      table.integer('product_category_id').notNullable()
      table.integer('product_sub_category_id').notNullable()
      table.enum('day_type', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
