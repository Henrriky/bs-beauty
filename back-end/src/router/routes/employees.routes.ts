import { Router } from 'express'
import { EmployeesController } from '../../controllers/employees.controller'
import { errorHandlerMiddleware } from '../../middlewares/error-handler.middleware'
import { validateCreateEmployee } from '../../middlewares/validate-create-employee.middleware'
import { validateUpdateEmployee } from '../../middlewares/validate-update-employee.middleware'

const employeeRoutes = Router()

employeeRoutes.get('/', EmployeesController.handleFindAll)
employeeRoutes.get('/:id', EmployeesController.handleFindById)
employeeRoutes.post('/', validateCreateEmployee, EmployeesController.handleCreate)
employeeRoutes.put('/:id', validateUpdateEmployee, EmployeesController.handleUpdate)
employeeRoutes.delete('/:id', EmployeesController.handleDelete)
employeeRoutes.use(errorHandlerMiddleware)

export { employeeRoutes }
