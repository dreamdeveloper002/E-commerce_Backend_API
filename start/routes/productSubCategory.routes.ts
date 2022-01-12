import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/create/:categoryId', 'ProductSubCategoriesController.createSubCategory').middleware(
    'auth'
  )
  Route.get('/:id', 'ProductSubCategoriesController.getSubCategory').middleware('auth')
  Route.put('update/:id', 'ProductSubCategoriesController.updateSubCategory').middleware('auth')
  Route.delete('delete/:id', 'ProductSubCategoriesController.deleteSubCategory').middleware('auth')
}).prefix('/api/v1/sub_category')
