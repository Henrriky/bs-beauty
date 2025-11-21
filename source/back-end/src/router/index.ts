import { Router } from 'express'
import { serviceRoutes } from './routes/services.routes'
import { customerRoutes } from './routes/customers.routes'
import { professionalRoutes } from './routes/professionals.routes'
import { notificationRoutes } from './routes/notifications.routes'
import { appointmentRoutes } from './routes/appointments.routes'
import { shiftRoutes } from './routes/shift.routes'
import { offerRoutes } from './routes/offers.routes'
import { roleRoutes } from './routes/roles.routes'
import { permissionRoutes } from './routes/permissions.routes'
import { errorHandlerMiddleware } from '../middlewares/error-handler.middleware'
import { authRoutes } from './routes/auth.routes'
import { verifyJwtTokenMiddleware } from '../middlewares/auth/verify-jwt-token.middleware'
import { analyticsServiceRoutes } from './routes/analytics.routes'
import { salonInfoRoutes } from './routes/salon-info.routes'
import { paymentRecordRoutes } from './routes/payment-record.routes'
import { notificationTemplatesRoutes } from './routes/notification-templates.routes'
import { ratingRoutes } from './routes/ratings.routes'
import { publicAnalyticsRoutes } from './routes/public-analytics.routes'
import { blockedTimesRoutes } from './routes/blocked-times.routes'
import { reportRoutes } from './routes/reports.routes'

const appRoutes = Router()

appRoutes.use('/auth', authRoutes)
appRoutes.use('/professionals', verifyJwtTokenMiddleware, professionalRoutes)
appRoutes.use('/services', verifyJwtTokenMiddleware, serviceRoutes)
appRoutes.use('/customers', verifyJwtTokenMiddleware, customerRoutes)
appRoutes.use('/notifications', verifyJwtTokenMiddleware, notificationRoutes)
appRoutes.use('/notification-templates', verifyJwtTokenMiddleware, notificationTemplatesRoutes)
appRoutes.use('/appointments', verifyJwtTokenMiddleware, appointmentRoutes)
appRoutes.use('/shifts', verifyJwtTokenMiddleware, shiftRoutes)
appRoutes.use('/offers', verifyJwtTokenMiddleware, offerRoutes)
appRoutes.use('/roles', verifyJwtTokenMiddleware, roleRoutes)
appRoutes.use('/permissions', verifyJwtTokenMiddleware, permissionRoutes)
appRoutes.use('/analytics', verifyJwtTokenMiddleware, analyticsServiceRoutes)
appRoutes.use('/salon-info', verifyJwtTokenMiddleware, salonInfoRoutes)
appRoutes.use('/payment-records', verifyJwtTokenMiddleware, paymentRecordRoutes)
appRoutes.use('/ratings', verifyJwtTokenMiddleware, ratingRoutes)
appRoutes.use('/public-analytics', publicAnalyticsRoutes)
appRoutes.use('/blocked-times', verifyJwtTokenMiddleware, blockedTimesRoutes)
appRoutes.use('/reports', reportRoutes)
appRoutes.use(errorHandlerMiddleware)

export { appRoutes }
