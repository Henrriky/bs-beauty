import { Router } from 'express'
import { ShiftController } from '../../controllers/shift.controller'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { Role } from '@prisma/client'
import { validateCreateShift } from '../../middlewares/data-validation/shift/create-shift.validation.middleware'
import { validateUpdateShift } from '../../middlewares/data-validation/shift/update-shift.validation.middleware'

const shiftRoutes = Router()

shiftRoutes.get('/', ShiftController.handleFindAll)
shiftRoutes.get('/employee/:id', ShiftController.handleFindByEmployeeId)
shiftRoutes.get('/:id', ShiftController.handleFindById)
shiftRoutes.post('/', routeAuthMiddleware([Role.EMPLOYEE, Role.MANAGER]), validateCreateShift, ShiftController.handleCreate)
shiftRoutes.put('/:id', routeAuthMiddleware([Role.EMPLOYEE, Role.MANAGER]), validateUpdateShift, ShiftController.handleUpdate)
shiftRoutes.delete('/:id', routeAuthMiddleware([Role.EMPLOYEE, Role.MANAGER]), ShiftController.handleDelete)

export { shiftRoutes }
