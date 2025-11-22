import { SalonInfoController } from '@/controllers/salon-info.controller'
import { userTypeAuthMiddleware } from '@/middlewares/auth/user-type-auth.middleware'
import { validateUpdateSalonInfo } from '@/middlewares/data-validation/salon-info/update-salon-info.validation.middleware'
import { Router } from 'express'

const salonInfoRoutes = Router()

salonInfoRoutes.get('/:id', userTypeAuthMiddleware(['MANAGER', 'PROFESSIONAL', 'CUSTOMER',]), SalonInfoController.handleFetchInfo)
salonInfoRoutes.put('/:id', userTypeAuthMiddleware(['MANAGER']), validateUpdateSalonInfo, SalonInfoController.handleUpdateInfo)

export { salonInfoRoutes }
