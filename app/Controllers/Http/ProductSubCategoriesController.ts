import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Logger from '@ioc:Adonis/Core/Logger'
import ProductCategory from 'App/Models/ProductCategory'
import ProductSubCategory from 'App/Models/ProductSubCategory'
const handlerResponse = require('App/utils/responseHandler')

export default class ProductSubCategoriesController {
  public async createSubCategory({ request, response, auth, params }: HttpContextContract) {
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
      const productCategoryId = params.categoryId
      const isUserAdmin = auth.user!.type === 'ADMIN'

      if (!isUserAdmin) {
        Logger.info('only admin user can create product category')
        return handlerResponse(response, 400, null, `only admin user can create product category`)
      }

      const productCategory = await ProductCategory.findBy('id', productCategoryId)

      //check if category exist
      if (!productCategory) {
        Logger.info('Product category does not exist')
        return handlerResponse(response, 404, null, `Product category does not exist`)
      }

      const { name, status } = req

      const productSubCategory = await ProductSubCategory.create({
        name,
        status,
        productCategoryId,
      })

      return handlerResponse(response, 200, {
        status: 'Success',
        data: productSubCategory,
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        data: error,
      })
    }
  }

  public async getSubCategory({ response, params }: HttpContextContract) {
    try {
      const subCategoryId = params.id
      const productSubCategory = await ProductSubCategory.findBy('id', subCategoryId)

      //check if category exist
      if (!productSubCategory) {
        Logger.info('Product category does not exist')
        return handlerResponse(response, 404, null, `Product sub_category does not exist`)
      }

      return handlerResponse(response, 201, {
        status: 'Success',
        data: productSubCategory,
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        data: error,
      })
    }
  }

  public async updateSubCategory({ request, response, auth, params }: HttpContextContract) {
    try {
      const isUserAdmin = auth.user!.type === 'ADMIN'

      if (!isUserAdmin) {
        Logger.info('only admin user can update product category')
        return handlerResponse(response, 400, null, `only admin user can update product category`)
      }

      const subCategory = params.id
      const { name, status } = request.all()

      const productSubCategory = await ProductSubCategory.findBy('id', subCategory)

      //check if category exist
      if (!productSubCategory) {
        Logger.info('Product category does not exist')
        return handlerResponse(response, 404, null, `Product sub_category does not exist`)
      }

      productSubCategory.name = name || productSubCategory.name
      productSubCategory.status = status || productSubCategory.status

      await productSubCategory.save()
      return handlerResponse(response, 201, {
        status: 'Success',
        data: productSubCategory,
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        data: error,
      })
    }
  }

  public async deleteSubCategory({ params, response, auth }: HttpContextContract) {
    try {
      const isUserAdmin = auth.user!.type === 'ADMIN'

      if (!isUserAdmin) {
        Logger.info('only admin user can create product category')
        return handlerResponse(response, 400, null, `only admin user can create product category`)
      }

      const subCategory = params.id
      const productSubCategory = await ProductSubCategory.findBy('id', subCategory)

      //check if category exist
      if (!productSubCategory) {
        Logger.info('Product category does not exist')
        return handlerResponse(response, 404, null, `Product sub_category does not exist`)
      }

      await productSubCategory.delete()
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
