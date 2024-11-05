import { Router } from 'express'
import { CustomersController } from '../../controllers/customers.controller'
import { errorHandlerMiddleware } from '../../middlewares/error-handler.middleware'

const customerRoutes = Router()

customerRoutes.get('/', CustomersController.handleFindAll)
customerRoutes.get('/:id', CustomersController.handleFindById)
customerRoutes.post('/', CustomersController.handleCreate)
customerRoutes.put('/:id', CustomersController.handleUpdate)
customerRoutes.delete('/:id', CustomersController.handleDelete)
customerRoutes.use(errorHandlerMiddleware)

export { customerRoutes }
