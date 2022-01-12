import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/create/:categoryId/:subCategoryId', 'ProductsController.createProduct').middleware(
    'auth'
  )
  Route.get('/:id', 'ProductsController.getProduct').middleware('auth')
  Route.put('update/:id', 'ProductsController.updateProduct').middleware('auth')
  Route.delete('delete/:id', 'ProductsController.deleteProduct').middleware('auth')
}).prefix('/api/v1/product')
