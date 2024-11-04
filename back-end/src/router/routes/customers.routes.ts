import { Router } from 'express'
import { CustomersController } from '../../controllers/customers.controller'

const customerRoutes = Router()

customerRoutes.get('/customers', CustomersController.handleFindAll)
customerRoutes.get('/customers/:id', CustomersController.handleFindById)
customerRoutes.post('/customers', CustomersController.handleCreate)
customerRoutes.put('/customers/:id', CustomersController.handleUpdate)
customerRoutes.delete('/customers/:id', CustomersController.handleDelete)

export { customerRoutes }
