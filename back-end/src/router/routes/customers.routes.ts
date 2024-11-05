import { Router } from 'express'
import { CustomersController } from '../../controllers/customers.controller'
import { errorHandlerMiddleware } from '../../middlewares/error-handler.middleware'
import { validateCreateCustomer } from '../../middlewares/validate-create-customer.middleware'
import { validateUpdateCustomer } from '../../middlewares/validate-update-customer.middleware'

const customerRoutes = Router()

customerRoutes.get('/', CustomersController.handleFindAll)
customerRoutes.get('/:id', CustomersController.handleFindById)
customerRoutes.post('/', validateCreateCustomer, CustomersController.handleCreate)
customerRoutes.put('/:id', validateUpdateCustomer, CustomersController.handleUpdate)
customerRoutes.delete('/:id', CustomersController.handleDelete)
customerRoutes.use(errorHandlerMiddleware)

export { customerRoutes }
