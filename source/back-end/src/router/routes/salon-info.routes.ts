import { SalonInfoController } from '@/controllers/salon-info.controller'
import { routeAuthMiddleware } from '@/middlewares/route-auth.middleware'
import { Router } from 'express'

const salonInfoRoutes = Router()

salonInfoRoutes.get('/:id', routeAuthMiddleware(['MANAGER', 'PROFESSIONAL', 'CUSTOMER']), SalonInfoController.handleFetchInfo)
salonInfoRoutes.put('/:id', routeAuthMiddleware(['MANAGER']), SalonInfoController.handleUpdateInfo)

export { salonInfoRoutes }
