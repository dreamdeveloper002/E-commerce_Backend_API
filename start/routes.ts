import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import './routes/auth.routes'
import '../start/routes/product.routes'
import '../start/routes/productCategory.routes'
import '../start/routes/productSubCategory.routes'

//connection health check
Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})
