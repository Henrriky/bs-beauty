import { Router } from 'express'
import { AnalyticsController } from '../../controllers/analytics.controller'

const analyticsServiceRoutes = Router()

analyticsServiceRoutes.get('/', AnalyticsController.handleFindAll)
analyticsServiceRoutes.get('/:id', AnalyticsController.handleFindByEmployeeId)
export { analyticsServiceRoutes }
