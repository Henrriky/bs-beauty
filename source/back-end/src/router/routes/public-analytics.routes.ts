import { Router } from 'express'
import { AnalyticsController } from '../../controllers/analytics.controller'

const publicAnalyticsRoutes = Router()

publicAnalyticsRoutes.get('/ratings', AnalyticsController.handleGetRatingsAnalytics)

export { publicAnalyticsRoutes }
