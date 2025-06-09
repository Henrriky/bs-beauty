import { Router } from 'express'
import { ServicesController } from '../../controllers/services.controller'
import { validateCreateService } from '../../middlewares/data-validation/service/create-service.validation.middleware'
import { validateUpdateService } from '../../middlewares/data-validation/service/update-service.validation.middleware'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { employeeQuerySchema } from '../../utils/validation/zod-schemas/pagination/employees/employees-query.schema'
import { validateQuery } from '../../middlewares/pagination/zod-request-validation.middleware'

const serviceRoutes = Router()

serviceRoutes.get('/', validateQuery(employeeQuerySchema), ServicesController.handleFindAllPaginated)
serviceRoutes.get('/:id', ServicesController.handleFindById)
serviceRoutes.get('/:id/offer/employees', ServicesController.handleFetchEmployeesOfferingService)
serviceRoutes.post('/', routeAuthMiddleware(['MANAGER', 'EMPLOYEE']), validateCreateService, ServicesController.handleCreate)
serviceRoutes.put('/:id', routeAuthMiddleware(['MANAGER', 'EMPLOYEE']), validateUpdateService, ServicesController.handleUpdate)
serviceRoutes.delete('/:id', routeAuthMiddleware(['MANAGER', 'EMPLOYEE']), ServicesController.handleDelete)

export { serviceRoutes }
