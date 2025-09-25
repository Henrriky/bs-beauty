import { SalonInfoController } from '@/controllers/salon-info.controller'
import { validateUpdateSalonInfo } from '@/middlewares/data-validation/salon-info/update-salon-info.validation.middleware'
import { routeAuthMiddleware } from '@/middlewares/route-auth.middleware'
import { Router } from 'express'

const salonInfoRoutes = Router()

salonInfoRoutes.get('/:id', routeAuthMiddleware(['MANAGER', 'PROFESSIONAL', 'CUSTOMER']), SalonInfoController.handleFetchInfo)
salonInfoRoutes.put('/:id', routeAuthMiddleware(['MANAGER']), validateUpdateSalonInfo, SalonInfoController.handleUpdateInfo)

export { salonInfoRoutes }
