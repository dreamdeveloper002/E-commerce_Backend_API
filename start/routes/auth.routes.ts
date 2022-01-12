import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/signup', 'AuthController.signup')
  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout')
  Route.post('/forgotpassword', 'AuthController.forgotPassword')
  Route.put('/resetpassword/:token', 'AuthController.resetPassword')
  Route.put('/updatepassword/:id', 'AuthController.changePassword').middleware('auth')
  Route.get('/verify/:email', 'AuthController.verifyEmail')
}).prefix('/api/v1/auth')
