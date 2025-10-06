import { Router } from 'express'
import { AnalyticsController } from '../../controllers/analytics.controller'
import { UserType } from '@prisma/client'
import { routeAuthMiddleware } from '@/middlewares/route-auth.middleware'

const analyticsServiceRoutes = Router()

analyticsServiceRoutes.get('/', routeAuthMiddleware([UserType.MANAGER]), AnalyticsController.handleFindAll)
analyticsServiceRoutes.get('/:id', routeAuthMiddleware([UserType.PROFESSIONAL, UserType.MANAGER]), AnalyticsController.handleFindByProfessionalId)
analyticsServiceRoutes.get('/customers/ratings', routeAuthMiddleware([UserType.MANAGER]), AnalyticsController.handleGetCustomerAmountPerRatingScore)
analyticsServiceRoutes.get('/services/rating', routeAuthMiddleware([UserType.MANAGER]), AnalyticsController.handleGetMeanRatingByService)
analyticsServiceRoutes.get('/professionals/rating', routeAuthMiddleware([UserType.MANAGER]), AnalyticsController.handleGetMeanRatingOfProfessionals)
export { analyticsServiceRoutes }
