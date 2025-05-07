import { Router } from 'express'
import { CustomersController } from '../../controllers/customers.controller'
import { validateCreateCustomer } from '../../middlewares/data-validation/customer/create-customer.validation.middleware'
import { validateUpdateCustomer } from '../../middlewares/data-validation/customer/update-customer.validation.middleware'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'

const customerRoutes = Router()

customerRoutes.get('/', CustomersController.handleFindAll)
customerRoutes.get('/:id', CustomersController.handleFindById)
customerRoutes.post('/', routeAuthMiddleware(['CUSTOMER']), validateCreateCustomer, CustomersController.handleCreate)
customerRoutes.put('/:id', routeAuthMiddleware(['CUSTOMER']), validateUpdateCustomer, CustomersController.handleUpdate)
customerRoutes.delete('/:id', routeAuthMiddleware(['CUSTOMER']), CustomersController.handleDelete)

export { customerRoutes }
