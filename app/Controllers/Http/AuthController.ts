/* eslint-disable @typescript-eslint/naming-convention */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'
import moment from 'moment'
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'
const crypto = require('crypto')
const handlerResponse = require('App/utils/responseHandler')

export default class AuthController {
  public async signup({ request, response, auth }: HttpContextContract) {
    const req = await request.validate({
      schema: schema.create({
        first_name: schema.string({ trim: true }, [rules.maxLength(225), rules.minLength(2)]),
        last_name: schema.string({ trim: true }, [rules.maxLength(225), rules.minLength(2)]),
        email: schema.string({ trim: true }, [rules.email(), rules.regex(/^\S+@\S+\.\S+$/)]),
        password: schema.string({ trim: true }, [rules.minLength(8)]),
        contact_number: schema.string({ trim: true }, [rules.mobile()]),
        address: schema.string({}, [rules.maxLength(225), rules.minLength(2)]),
        gender: schema.string({ trim: true }, [rules.maxLength(8), rules.minLength(2)]),
        type: schema.enum(['BASIC', 'ADMIN', 'SUPER_ADMIN']),
      }),
      messages: {
        'first_name.required': 'First name is required to sign up',
        'first_name.maxLength': 'First name can not be more than 225 characters',
        'first_name.minLength': 'First name can not be less than 2 characters',
        'last_name.required': 'Last name is required to sign up',
        'last_name.maxLength': 'Last name can not be more than 225 characters',
        'last_name.minLength': 'Last name can not be less than 2 characters',
        'email.required': 'Email is required to sign up',
        'password.required': 'Password is required to sign up',
        'password.minLength': 'Password must be at least 8 characters',
        'contact_number.required': 'Phone number is required to sign up',
        'address.required': 'Job title is required to sign up',
        'address.maxLength': 'Address can not be more than 225 characters',
        'address.minLength': 'Address can not be less than 2 characters',
        'gender.required': 'Gender is required',
        'type.required': "User's type is required to sign up",
      },
    })

    try {
      const { first_name, last_name, email, password, contact_number, address, gender, type } = req

      const checkUserExist = await User.findBy('email', email)

      //check if user with mail already exist
      if (checkUserExist) {
        Logger.info('user with email already exist')
        return handlerResponse(response, 400, null, `user with ${email} already exist`)
      }

      //Create new user
      const user = await User.create({
        first_name,
        last_name,
        contact_number,
        email,
        password,
        address,
        type,
        gender,
      })

      const url = `${request.protocol()}://${request.host()}/api/v1/auth/verify/${email}`

      await Mail.send((message) => {
        message
          .from('verify@ecommerce.com')
          .to(email)
          .subject('Email verification')
          .htmlView('emails/verify', { user, url })
      })

      //Generate token for newly created user
      const token = await auth.use('api').login(user, {
        expiresIn: '10 days',
      })

      return handlerResponse(response, 201, {
        status: 'Success',
        data: user,
        token,
      })
    } catch (error) {
      console.log(error)
      return handlerResponse(response, 500, {
        status: 'False',
        message: error.message,
      })
    }
  }

  public async verifyEmail({ response, params }: HttpContextContract) {
    const email = params.email

    try {
      const user = await User.findBy('email', email)

      //check if user email exist
      if (!user) {
        Logger.info('User with email does not exist')
        return handlerResponse(response, 404, null, "User doesn't exist")
      }

      if (user.email_verified === true) {
        Logger.info('User email already verified')
        return handlerResponse(response, 404, null, 'User email already verified')
      }

      const date = Date.now()

      user.email_verified = true
      user.email_verified_at = moment(date).format('MM/DD/YYYY')

      await user.save()

      return handlerResponse(response, 201, {
        status: 'Success',
        data: user,
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        message: error.message,
      })
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const req = await request.validate({
      schema: schema.create({
        email: schema.string({}, [rules.email()]),
        password: schema.string({}, [rules.minLength(8), rules.regex(/^\S+@\S+\.\S+$/)]),
      }),

      messages: {
        'email.required': 'Email is required to sign up',
        'password.required': 'Password is required to sign up',
        'password.minLength': 'Password must be at least 8 characters',
      },
    })

    const email = req.email
    const password = req.password

    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '10 days',
      })

      return handlerResponse(response, 200, {
        status: 'Success',
        data: token,
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        message: error.message,
      })
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').revoke()
      return handlerResponse(response, 200, {
        status: true,
        message: 'Successfully logged out',
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        message: error.message,
      })
    }
  }

  public async forgotPassword({ request, response }: HttpContextContract) {
    const req = await request.validate({
      schema: schema.create({
        email: schema.string({}, [rules.email()]),
      }),

      messages: {
        'email.required': 'Email is required to sign up',
      },
    })

    //init transaction process
    const trx = await Database.beginGlobalTransaction()

    try {
      const user = await User.findBy('email', req.email)

      //check if email exist
      if (!user) {
        return handlerResponse(response, 404, null, `There is no user with this email`)
      }

      //Get reset token
      const token = await user.getResetPasswordToken()
      const email = user?.email

      const url = `${request.protocol()}://${request.host()}/api/v1/auth/resetpassword/${token}`
      await user.save()

      await Mail.send((message) => {
        message
          .from('verify@adonisgram.com')
          .to(email)
          .subject('Password recovery email')
          .htmlView('emails/recover', { user, url })
      })

      //commit all transaction if no fail process
      await trx.commit()

      return handlerResponse(response, 200, {
        status: 'Success',
        message: 'check your mail for password reset link',
      })
    } catch (error) {
      //rollback transaction if there's any failed process
      await trx.rollback()

      return handlerResponse(response, 500, {
        status: 'False',
        message: error.message,
      })
    }
  }

  public async resetPassword({ request, response, params }: HttpContextContract) {
    const req = await request.validate({
      schema: schema.create({
        password: schema.string({}, [rules.minLength(8)]),
      }),

      messages: {
        'password.required': 'Password is required to sign up',
        'password.minLength': 'Password must be at least 8 characters',
      },
    })

    const password = req.password
    const tokenProvided = params.token

    try {
      const resetPasswordToken = crypto.createHash('sha256').update(tokenProvided).digest('hex')

      // looking for user with the registered email
      const user = await User.findByOrFail('token', resetPasswordToken)

      const sameToken = resetPasswordToken === user?.token

      if (!sameToken) {
        return handlerResponse(response, 400, {
          status: 'Failed',
          message: 'Old token provided or token already used',
        })
      }

      const currentTime = Math.floor(Date.now() / 1000)

      if (user.token_created_at > currentTime) {
        // saving new password
        user.password = password

        // deleting current token
        user.token = ''
        user.token_created_at = 0

        // persisting data (saving)
        await user.save()

        return handlerResponse(response, 200, {
          status: 'Success',
          message: 'Password updated successfully. You can now login with your new password',
        })
      }

      // deleting current token
      user.token = ''
      user.token_created_at = 0

      // persisting data (saving)
      await user.save()

      return handlerResponse(response, 200, {
        status: 'False',
        message: 'Token expired',
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        message: error.message,
      })
    }
  }

  public async changePassword({ request, response, params }: HttpContextContract) {
    const req = await request.validate({
      schema: schema.create({
        currentPassword: schema.string({}, [rules.minLength(8)]),
        newPassword: schema.string({}, [rules.minLength(8)]),
      }),

      messages: {
        'password.required': 'Password is required to sign up',
        'password.minLength': 'Password must be at least 8 characters',
        'newPassword.required': 'Password is required to sign up',
        'newPassword.minLength': 'Password must be at least 8 characters',
      },
    })

    const newPassword = req.newPassword
    const currentPassword = req.currentPassword
    const id = params.id

    try {
      // const user = auth.user!
      const user = await User.findBy('id', id)
      const previousPassword = user!.password

      // Verify password
      if (!(await Hash.verify(previousPassword, currentPassword))) {
        return response.status(400).json({
          status: 'error',
          message: 'Current password could not be verified! Please try again.',
        })
      }

      user!.password = newPassword
      await user!.save()

      return handlerResponse(response, 200, {
        status: 'Success',
        message: 'Password updated!',
      })
    } catch (error) {
      console.log(error)
      return handlerResponse(response, 500, {
        status: 'False',
        message: error.message,
      })
    }
  }
}
