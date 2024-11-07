import { Router } from 'express'
import { serviceRoutes } from './routes/services.routes'
import { customerRoutes } from './routes/customers.routes'
import { employeeRoutes } from './routes/employees.routes'
import { notificationRoutes } from './routes/notifications.routes'

const appRoutes = Router()

appRoutes.use('/employees', employeeRoutes)
appRoutes.use('/services', serviceRoutes)
appRoutes.use('/customers', customerRoutes)
appRoutes.use('/notifications', notificationRoutes)

export { appRoutes }
