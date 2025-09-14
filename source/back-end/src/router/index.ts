import { Router } from 'express'
import { serviceRoutes } from './routes/services.routes'
import { customerRoutes } from './routes/customers.routes'
import { professionalRoutes } from './routes/professionals.routes'
import { notificationRoutes } from './routes/notifications.routes'
import { appointmentRoutes } from './routes/appointments.routes'
import { shiftRoutes } from './routes/shift.routes'
import { offerRoutes } from './routes/offers.routes'
import { errorHandlerMiddleware } from '../middlewares/error-handler.middleware'
import { authRoutes } from './routes/auth.routes'
import { verifyJwtTokenMiddleware } from '../middlewares/auth/verify-jwt-token.middleware'
import { analyticsServiceRoutes } from './routes/analytics.routes'
import { salonInfoRoutes } from './routes/salon-info.routes'

const appRoutes = Router()

appRoutes.use('/auth', authRoutes)
appRoutes.use('/professionals', verifyJwtTokenMiddleware, professionalRoutes)
appRoutes.use('/services', verifyJwtTokenMiddleware, serviceRoutes)
appRoutes.use('/customers', verifyJwtTokenMiddleware, customerRoutes)
appRoutes.use('/notifications', verifyJwtTokenMiddleware, notificationRoutes)
appRoutes.use('/appointments', verifyJwtTokenMiddleware, appointmentRoutes)
appRoutes.use('/shifts', verifyJwtTokenMiddleware, shiftRoutes)
appRoutes.use('/offers', verifyJwtTokenMiddleware, offerRoutes)
appRoutes.use('/analytics', verifyJwtTokenMiddleware, analyticsServiceRoutes)
appRoutes.use('/salon-info', verifyJwtTokenMiddleware, salonInfoRoutes)
appRoutes.use(errorHandlerMiddleware)

export { appRoutes }
