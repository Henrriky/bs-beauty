import { Router } from 'express'
import { ServicesController } from '../../controllers/services.controller'
import { validateCreateService } from '../../middlewares/data-validation/service/create-service.validation.middleware'
import { validateUpdateService } from '../../middlewares/data-validation/service/update-service.validation.middleware'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'

const serviceRoutes = Router()

serviceRoutes.get('/', ServicesController.handleFindAllPaginated)
serviceRoutes.get('/:id', ServicesController.handleFindById)
serviceRoutes.get('/:id/offer/professionals', ServicesController.handleFetchProfessionalsOfferingService)
serviceRoutes.post('/', routeAuthMiddleware(['MANAGER', 'PROFESSIONAL']), validateCreateService, ServicesController.handleCreate)
serviceRoutes.put('/:id', routeAuthMiddleware(['MANAGER', 'PROFESSIONAL']), validateUpdateService, ServicesController.handleUpdate)
serviceRoutes.delete('/:id', routeAuthMiddleware(['MANAGER', 'PROFESSIONAL']), ServicesController.handleDelete)

export { serviceRoutes }
