import { Router } from 'express'
import { serviceRoutes } from './routes/services.routes'
import { customerRoutes } from './routes/customers.routes'
import { employeeRoutes } from './routes/employees.routes'
import { notificationRoutes } from './routes/notifications.routes'
import { appointmentRoutes } from './routes/appointments.routes'
import { appointmentServiceRoutes } from './routes/appointment-services.routes'
import { shiftRoutes } from './routes/shift.routes'
import { offerRoutes } from './routes/offers.routes'
import { errorHandlerMiddleware } from '../middlewares/error-handler.middleware'
import { authRoutes } from './routes/auth.routes'
import { verifyJwtTokenMiddleware } from '../middlewares/auth/verify-jwt-token.middleware'
import { analyticsServiceRoutes } from './routes/analytics.routes'

const appRoutes = Router()

appRoutes.use('/auth', authRoutes)
appRoutes.use('/employees', verifyJwtTokenMiddleware, employeeRoutes)
appRoutes.use('/services', verifyJwtTokenMiddleware, serviceRoutes)
appRoutes.use('/customers', verifyJwtTokenMiddleware, customerRoutes)
appRoutes.use('/notifications', verifyJwtTokenMiddleware, notificationRoutes)
appRoutes.use('/appointments', verifyJwtTokenMiddleware, appointmentRoutes)
appRoutes.use('/appointment-services', verifyJwtTokenMiddleware, appointmentServiceRoutes)
appRoutes.use('/shifts', verifyJwtTokenMiddleware, shiftRoutes)
appRoutes.use('/offers', verifyJwtTokenMiddleware, offerRoutes)
appRoutes.use('/analytics', verifyJwtTokenMiddleware, analyticsServiceRoutes)
appRoutes.use(errorHandlerMiddleware)

export { appRoutes }
