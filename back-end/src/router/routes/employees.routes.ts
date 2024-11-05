import { Router } from 'express'
import { EmployeesController } from '../../controllers/employees.controller'
import { errorHandlerMiddleware } from '../../middlewares/error-handler.middleware'

const employeeRoutes = Router()

employeeRoutes.get('/', EmployeesController.handleFindAll)
employeeRoutes.get('/:id', EmployeesController.handleFindById)
employeeRoutes.post('/', EmployeesController.handleCreate)
employeeRoutes.put('/:id', EmployeesController.handleUpdate)
employeeRoutes.delete('/:id', EmployeesController.handleDelete)
employeeRoutes.use(errorHandlerMiddleware)

export { employeeRoutes }
