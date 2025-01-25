import { Router } from 'express'
import { AnalyticsController } from '../../controllers/analytics.controller'

const analyticsServiceRoutes = Router()

analyticsServiceRoutes.get('/', AnalyticsController.handleFindAll)

export { analyticsServiceRoutes }
