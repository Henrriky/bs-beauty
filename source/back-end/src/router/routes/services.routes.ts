import { Router } from 'express'
import { ServicesController } from '../../controllers/services.controller'
import { validateCreateService } from '../../middlewares/data-validation/service/create-service.validation.middleware'
import { validateUpdateService } from '../../middlewares/data-validation/service/update-service.validation.middleware'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { professionalQuerySchema } from '../../utils/validation/zod-schemas/pagination/professionals/professionals-query.schema'
import { validateQuery } from '../../middlewares/pagination/zod-request-validation.middleware'

const serviceRoutes = Router()

serviceRoutes.get('/', validateQuery(professionalQuerySchema), ServicesController.handleFindAllPaginated)
serviceRoutes.get('/:id', ServicesController.handleFindById)
serviceRoutes.get('/:id/offer/professionals', ServicesController.handleFetchProfessionalsOfferingService)
serviceRoutes.post('/', routeAuthMiddleware(['MANAGER', 'PROFESSIONAL']), validateCreateService, ServicesController.handleCreate)
serviceRoutes.put('/:id', routeAuthMiddleware(['MANAGER', 'PROFESSIONAL']), validateUpdateService, ServicesController.handleUpdate)
serviceRoutes.delete('/:id', routeAuthMiddleware(['MANAGER', 'PROFESSIONAL']), ServicesController.handleDelete)

export { serviceRoutes }
