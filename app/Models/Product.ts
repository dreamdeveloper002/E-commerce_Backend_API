import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import ProductCategory from './ProductCategory'
import ProductSubCategory from './ProductSubCategory'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public day_type: string

  @column()
  public description: string

  @column()
  public address: string

  @column()
  public userId: number

  @column()
  public productSubCategoryId: number

  @column()
  public productCategoryId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => ProductCategory)
  public ProductCategory: BelongsTo<typeof ProductCategory>

  @belongsTo(() => ProductSubCategory)
  public ProductSubCategory: BelongsTo<typeof ProductSubCategory>

  @column()
  public type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
