import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Logger from '@ioc:Adonis/Core/Logger'
import ProductCategory from 'App/Models/ProductCategory'
const handlerResponse = require('App/utils/responseHandler')

export default class ProductCategoriesController {
  public async createCategory({ request, response, auth }: HttpContextContract) {
    const req = await request.validate({
      schema: schema.create({
        name: schema.string({}, [rules.maxLength(225), rules.minLength(2)]),
        status: schema.string({}),
      }),
      messages: {
        'name.required': 'Category name is required',
        'status.required': 'Category status is required',
      },
    })

    try {
      const isUserAdmin = auth.user!.type === 'ADMIN'

      if (!isUserAdmin) {
        Logger.info('only admin user can create product category')
        return handlerResponse(response, 400, null, `only admin user can create product category`)
      }

      const { name, status } = req

      const productCategory = await ProductCategory.create({ name, status })

      return handlerResponse(response, 200, {
        status: 'Success',
        data: productCategory,
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        data: error,
      })
    }
  }

  public async getCategory({ response, params }: HttpContextContract) {
    try {
      const categoryId = params.id
      const productCategory = await ProductCategory.findBy('id', categoryId)

      //check if category exist
      if (!productCategory) {
        Logger.info('Product category does not exist')
        return handlerResponse(response, 404, null, `Product category does not exist`)
      }

      return handlerResponse(response, 201, {
        status: 'Success',
        data: productCategory,
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        data: error,
      })
    }
  }

  public async updateCategory({ request, response, auth, params }: HttpContextContract) {
    try {
      const isUserAdmin = auth.user!.type === 'ADMIN'

      if (!isUserAdmin) {
        Logger.info('only admin user can update product category')
        return handlerResponse(response, 400, null, `only admin user can update product category`)
      }

      const categoryId = params.id
      const { name, status } = request.all()

      const category = await ProductCategory.findBy('id', categoryId)

      //check if category exist
      if (!category) {
        Logger.info('Product category does not exist')
        return handlerResponse(response, 404, null, `Product category does not exist`)
      }

      category.name = name || category.name
      category.status = status || category.status

      await category.save()
      return handlerResponse(response, 201, {
        status: 'Success',
        data: category,
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        data: error,
      })
    }
  }

  public async deleteCategory({ params, response, auth }: HttpContextContract) {
    try {
      const isUserAdmin = auth.user!.type === 'ADMIN'

      if (!isUserAdmin) {
        Logger.info('only admin user can create product category')
        return handlerResponse(response, 400, null, `only admin user can create product category`)
      }

      const categoryId = params.id
      const category = await ProductCategory.findBy('id', categoryId)

      //check if category exist
      if (!category) {
        Logger.info('Product category does not exist')
        return handlerResponse(response, 404, null, `Product category does not exist`)
      }

      await category.delete()
      return handlerResponse(response, 200, {
        status: 'Success',
        data: {},
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        data: error,
      })
    }
  }
}
