import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Product from 'App/Models/Product'
import ProductCategory from 'App/Models/ProductCategory'
import ProductSubCategory from 'App/Models/ProductSubCategory'
const handlerResponse = require('App/utils/responseHandler')

export default class ProductsController {
  public async createProduct({ request, response, params, auth }: HttpContextContract) {
    const req = await request.validate({
      schema: schema.create({
        address: schema.string({}, [rules.maxLength(250), rules.minLength(2)]),
        title: schema.string({}, [rules.maxLength(250), rules.minLength(2)]),
        description: schema.string({}),
      }),
      messages: {
        'address.required': 'Address is required',
        'address.maxLength': 'Address can not be more than 250 characters',
        'address.minLength': 'Address can not be less than 2 characters',
        'title.required': 'Title is required',
        'title.maxLength': 'Title can not be more than 250 characters',
        'title.minLength': 'Title can not be less than 2 characters',
        'description.required': 'Description is required',
      },
    })

    try {
      const isUserAdmin = auth.user!.type === 'Admin'

      if (!isUserAdmin) {
        Logger.info('only admin user can create product category')
        return handlerResponse(response, 400, null, `only admin user can create product`)
      }

      const { address, title, description } = req
      const { categoryId, subCategoryId } = params

      const productCategory = await ProductCategory.findBy('id', categoryId)

      //check if category exist
      if (!productCategory) {
        Logger.info('Product category does not exist')
        return handlerResponse(response, 404, null, `Product category does not exist`)
      }

      const productSubCategory = await ProductSubCategory.findBy('id', subCategoryId)

      //check if sub_category exist
      if (!productSubCategory) {
        Logger.info('Product sub_category does not exist')
        return handlerResponse(response, 404, null, `Product sub_category does not exist`)
      }

      const product = await Product.create({
        address,
        title,
        description,
        userId: auth.user!.id,
        productSubCategoryId: subCategoryId,
        productCategoryId: categoryId,
      })

      return handlerResponse(response, 200, {
        status: 'Success',
        data: product,
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        message: error.message,
      })
    }
  }

  public async getProduct({ response, params }: HttpContextContract) {
    try {
      const productId = params.id
      const product = await Product.findBy('id', productId)

      //check if product exist
      if (!product) {
        Logger.info('Product category does not exist')
        return handlerResponse(response, 404, null, `Product does not exist`)
      }

      return handlerResponse(response, 201, {
        status: 'Success',
        data: product,
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        message: error.message,
      })
    }
  }

  public async updateProduct({ request, response, auth, params }: HttpContextContract) {
    try {
      const isUserAdmin = auth.user!.type === 'Admin'

      if (!isUserAdmin) {
        Logger.info('only admin user can update product category')
        return handlerResponse(response, 400, null, `only admin user can update product category`)
      }

      const { address, title, description } = request.all()
      const productId = params.id

      const product = await Product.findBy('id', productId)

      //check if product exist
      if (!product) {
        Logger.info('Product category does not exist')
        return handlerResponse(response, 404, null, `Product does not exist`)
      }

      const isProductCreator = auth.user!.id === product.userId

      //check if user is product owner
      if (!isProductCreator) {
        Logger.info('Only product owner can update product')
        return handlerResponse(response, 400, null, `Only product owner can update product`)
      }

      product.address = address || product.address
      product.title = title || product.title
      product.description = description || product.description

      await product.save()
      return handlerResponse(response, 201, {
        status: 'Success',
        data: product,
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        message: error.message,
      })
    }
  }

  public async deleteProduct({ params, response, auth }: HttpContextContract) {
    try {
      const isUserAdmin = auth.user!.type === 'Admin'

      if (!isUserAdmin) {
        Logger.info('only admin user can delete product')
        return handlerResponse(response, 400, null, `only admin user can delete product`)
      }

      const productId = params.id
      const product = await Product.findBy('id', productId)

      //check if category exist
      if (!product) {
        Logger.info('Product does not exist')
        return handlerResponse(response, 404, null, `Product does not exist`)
      }

      const isProductCreator = auth.user!.id === product.userId

      //check if user is product owner
      if (!isProductCreator) {
        Logger.info('Only product owner can delete product')
        return handlerResponse(response, 400, null, `Only product owner can delete product`)
      }

      await product.delete()
      return handlerResponse(response, 200, {
        status: 'Success',
        data: {},
      })
    } catch (error) {
      return handlerResponse(response, 500, {
        status: 'False',
        message: error.message,
      })
    }
  }
}
