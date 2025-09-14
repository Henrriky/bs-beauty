import { SalonSettingsController } from '@/controllers/salon-settings.controller'
import { routeAuthMiddleware } from '@/middlewares/route-auth.middleware'
import { Router } from 'express'

const salonSettingsRoutes = Router()

salonSettingsRoutes.get('/:id', routeAuthMiddleware(['MANAGER', 'PROFESSIONAL', 'CUSTOMER']), SalonSettingsController.handleFetchInfo)
salonSettingsRoutes.put('/:id', routeAuthMiddleware(['MANAGER']), SalonSettingsController.handleUpdateInfo)

export { salonSettingsRoutes }