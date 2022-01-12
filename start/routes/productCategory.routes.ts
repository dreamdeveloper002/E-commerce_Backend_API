import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/create', 'ProductCategoriesController.createCategory').middleware('auth')
  Route.get('/:id', 'ProductCategoriesController.getCategory').middleware('auth')
  Route.put('/update/:id', 'ProductCategoriesController.updateCategory').middleware('auth')
  Route.delete('/delete/:id', 'ProductCategoriesController.deleteCategory').middleware('auth')
}).prefix('/api/v1/category')
