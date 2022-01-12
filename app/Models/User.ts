import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Product from './Product'
const crypto = require('crypto')

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public email: string

  @column()
  public type: string

  @column()
  public status: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public email_verified: boolean

  @column()
  public contact_number: string

  @column()
  public gender: string

  @column()
  public address: string

  @hasMany(() => Product)
  public product: HasMany<typeof Product>

  @column()
  public last_login_ip: string

  @column()
  public email_verified_at: string

  @column.dateTime()
  public last_login_date: DateTime

  @column()
  public token: string

  @column()
  public token_created_at: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public async getResetPasswordToken() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hash token and set reset to resetPasswordToken field
    this.token = crypto.createHash('sha256').update(resetToken).digest('hex')

    //Set expire
    this.token_created_at = Math.floor(Date.now() / 1000) + 60 * 30 * 24

    return resetToken
  }
}
