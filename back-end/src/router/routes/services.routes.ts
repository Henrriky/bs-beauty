import { Router } from 'express'
import { ServicesController } from '../../controllers/services.controller'
import { errorHandlerMiddleware } from '../../middlewares/error-handler.middleware'
import { validateCreateService } from '../../middlewares/validate-create-service.middleware'

const serviceRoutes = Router()

serviceRoutes.get('/', ServicesController.handleFindAll)
serviceRoutes.get('/:id', ServicesController.handleFindById)
serviceRoutes.post('/', validateCreateService, ServicesController.handleCreate)
serviceRoutes.put('/:id', validateCreateService, ServicesController.handleUpdate)
serviceRoutes.delete('/:id', ServicesController.handleDelete)
serviceRoutes.use(errorHandlerMiddleware)
export { serviceRoutes }
