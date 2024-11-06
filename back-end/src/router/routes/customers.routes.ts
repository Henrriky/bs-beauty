import { Router } from 'express'
import { CustomersController } from '../../controllers/customers.controller'
import { errorHandlerMiddleware } from '../../middlewares/error-handler.middleware'
import { validateCreateCustomer } from '../../middlewares/data-validation/create/validate-create-customer.middleware'
import { validateUpdateCustomer } from '../../middlewares/data-validation/update/validate-update-customer.middleware'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'

const customerRoutes = Router()

customerRoutes.get('/', CustomersController.handleFindAll)
customerRoutes.get('/:id', CustomersController.handleFindById)
customerRoutes.post('/', routeAuthMiddleware(['CUSTOMER']), validateCreateCustomer, CustomersController.handleCreate)
customerRoutes.put('/:id', routeAuthMiddleware(['CUSTOMER']), validateUpdateCustomer, CustomersController.handleUpdate)
customerRoutes.delete('/:id', routeAuthMiddleware(['CUSTOMER']), CustomersController.handleDelete)
customerRoutes.use(errorHandlerMiddleware)

export { customerRoutes }
