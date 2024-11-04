import { Router } from 'express'
import { serviceRoutes } from './routes/services.routes'
import { customerRoutes } from './routes/customers.routes'
import { employeeRoutes } from './routes/employees.routes'

const appRoutes = Router()

appRoutes.use(employeeRoutes)
appRoutes.use(serviceRoutes)
appRoutes.use(customerRoutes)

export { appRoutes }
