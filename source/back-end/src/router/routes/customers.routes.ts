import { combinedAuthMiddleware } from '@/middlewares/auth/combined-auth.middleware'
import { Router } from 'express'
import { CustomersController } from '../../controllers/customers.controller'
import { validateCreateCustomer } from '../../middlewares/data-validation/customer/create-customer.validation.middleware'
import { validateUpdateCustomer } from '../../middlewares/data-validation/customer/update-customer.validation.middleware'
import { userTypeAuthMiddleware } from '../../middlewares/auth/user-type-auth.middleware'

const customerRoutes = Router()

/* Public Routes */
customerRoutes.get('/:id', CustomersController.handleFindById)

/* Protected Routes */
customerRoutes.get('/', combinedAuthMiddleware(['MANAGER'], ['customer.read']), CustomersController.handleFindAllPaginated)
customerRoutes.post('/', userTypeAuthMiddleware(['MANAGER']), validateCreateCustomer, CustomersController.handleCreate)
customerRoutes.put('/:id', userTypeAuthMiddleware(['CUSTOMER']), validateUpdateCustomer, CustomersController.handleUpdate)
customerRoutes.delete('/:id', combinedAuthMiddleware(['CUSTOMER'], ['customer.delete']), CustomersController.handleDelete)

export { customerRoutes }
