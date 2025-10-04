import { Router } from 'express'
import { ServicesController } from '../../controllers/services.controller'
import { validateCreateService } from '../../middlewares/data-validation/service/create-service.validation.middleware'
import { validateUpdateService } from '../../middlewares/data-validation/service/update-service.validation.middleware'
import { combinedAuthMiddleware } from '@/middlewares/auth/combined-auth.middleware'

const serviceRoutes = Router()

/* Public routes */
serviceRoutes.get('/', ServicesController.handleFindAllPaginated)
serviceRoutes.get('/:id/offer/professionals', ServicesController.handleFetchProfessionalsOfferingService)
serviceRoutes.get('/:id', ServicesController.handleFindById)

/* Protected routes */
serviceRoutes.post('/', combinedAuthMiddleware(['MANAGER'], ['service.create']), validateCreateService, ServicesController.handleCreate)
serviceRoutes.put('/:id', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['service.edit']), validateUpdateService, ServicesController.handleUpdate)
serviceRoutes.delete('/:id', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['service.delete']), ServicesController.handleDelete)

export { serviceRoutes }
