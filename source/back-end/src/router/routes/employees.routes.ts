import { Router } from 'express'
import { EmployeesController } from '../../controllers/employees.controller'
import { validateCreateEmployee } from '../../middlewares/data-validation/employee/create-employee.validation.middleware'
import { validateUpdateEmployee } from '../../middlewares/data-validation/employee/update-employee.validation.middleware'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { validateQuery } from '../../middlewares/pagination/zod-request-validation.middleware'
import { employeeQuerySchema } from '../../utils/validation/zod-schemas/pagination/employees/employees-query.schema'

const employeeRoutes = Router()

employeeRoutes.get('/', routeAuthMiddleware(['MANAGER', 'CUSTOMER']), validateQuery(employeeQuerySchema), EmployeesController.handleFindAll)
employeeRoutes.get('/:id', routeAuthMiddleware(['MANAGER']), EmployeesController.handleFindById)
employeeRoutes.post('/', routeAuthMiddleware(['MANAGER']), validateCreateEmployee, EmployeesController.handleCreate)
employeeRoutes.put('/:id', routeAuthMiddleware(['MANAGER', 'EMPLOYEE']), validateUpdateEmployee, EmployeesController.handleUpdate)
employeeRoutes.delete('/:id', routeAuthMiddleware(['MANAGER']), EmployeesController.handleDelete)
employeeRoutes.get('/:id/offers/service', EmployeesController.handleFetchServicesOfferedByEmployee)

export { employeeRoutes }
