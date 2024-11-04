import { Router } from 'express'
import { EmployeesController } from '../../controllers/employees.controller'

const employeeRoutes = Router()

employeeRoutes.get('/employees', EmployeesController.handleFindAll)
employeeRoutes.get('/employees/:id', EmployeesController.handleFindById)
employeeRoutes.post('/employees', EmployeesController.handleCreate)
employeeRoutes.put('/employees/:id', EmployeesController.handleUpdate)
employeeRoutes.delete('/employees/:id', EmployeesController.handleDelete)

export { employeeRoutes }
