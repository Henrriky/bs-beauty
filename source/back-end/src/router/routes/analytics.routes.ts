import { Router } from 'express'
import { AnalyticsController } from '../../controllers/analytics.controller'
import { userTypeAuthMiddleware } from '../../middlewares/auth/user-type-auth.middleware'

const analyticsServiceRoutes = Router()

analyticsServiceRoutes.get('/', userTypeAuthMiddleware(['MANAGER']), AnalyticsController.handleFindAll)
analyticsServiceRoutes.get('/:id', userTypeAuthMiddleware(['PROFESSIONAL', 'MANAGER']), AnalyticsController.handleFindByProfessionalId)
analyticsServiceRoutes.get('/customers/ratings', userTypeAuthMiddleware(['MANAGER']), AnalyticsController.handleGetCustomerAmountPerRatingScore)
analyticsServiceRoutes.get('/services/rating', userTypeAuthMiddleware(['MANAGER']), AnalyticsController.handleGetMeanRatingByService)
analyticsServiceRoutes.get('/professionals/rating', userTypeAuthMiddleware(['MANAGER']), AnalyticsController.handleGetMeanRatingOfProfessionals)
analyticsServiceRoutes.get('/appointments/amount', userTypeAuthMiddleware(['MANAGER', 'PROFESSIONAL']), AnalyticsController.handleGetAppointmentAmountInDateRangeByStatusAndProfessional)
export { analyticsServiceRoutes }
