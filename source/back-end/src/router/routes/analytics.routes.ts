import { Router } from 'express'
import { AnalyticsController } from '../../controllers/analytics.controller'
import { userTypeAuthMiddleware } from '../../middlewares/auth/user-type-auth.middleware'
import { validateFetchAppointmentsCount } from '@/middlewares/data-validation/analytics/fetch-appointments-count.validation.middleware'

const analyticsServiceRoutes = Router()

analyticsServiceRoutes.get('/', userTypeAuthMiddleware(['MANAGER']), AnalyticsController.handleFindAll)
analyticsServiceRoutes.get('/:id', userTypeAuthMiddleware(['PROFESSIONAL', 'MANAGER']), AnalyticsController.handleFindByProfessionalId)
analyticsServiceRoutes.get('/customers/ratings', userTypeAuthMiddleware(['MANAGER']), AnalyticsController.handleGetCustomerAmountPerRatingScore)
analyticsServiceRoutes.get('/services/rating', userTypeAuthMiddleware(['MANAGER']), AnalyticsController.handleGetMeanRatingByService)
analyticsServiceRoutes.get('/professionals/rating', userTypeAuthMiddleware(['MANAGER']), validateFetchAppointmentsCount,AnalyticsController.handleGetMeanRatingOfProfessionals)
analyticsServiceRoutes.get('/appointments/count', userTypeAuthMiddleware(['MANAGER', 'PROFESSIONAL']), validateFetchAppointmentsCount, AnalyticsController.handleGetAppointmentAmountInDateRangeByStatusAndProfessional)
analyticsServiceRoutes.get('/appointments/estimated-time', userTypeAuthMiddleware(['MANAGER', 'PROFESSIONAL']), validateFetchAppointmentsCount, AnalyticsController.handleGetEstimatedAppointmentTimeInDateRangeByProfessional)
analyticsServiceRoutes.get('/appointments/cancelation-rate', userTypeAuthMiddleware(['MANAGER', 'PROFESSIONAL']), validateFetchAppointmentsCount, AnalyticsController.handleGetAppointmentCancelationRateByProfessional)
export { analyticsServiceRoutes }
