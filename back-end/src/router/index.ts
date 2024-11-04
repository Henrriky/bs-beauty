import { Router } from 'express'
import { serviceRoutes } from './routes/services.routes'
import { customerRoutes } from './routes/customers.routes'

const appRoutes = Router()

appRoutes.use(serviceRoutes)
appRoutes.use(customerRoutes)

export { appRoutes }
