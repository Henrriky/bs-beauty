import { Router } from 'express'
import { ShiftController } from '../../controllers/shift.controller'
import { errorHandlerMiddleware } from '../../middlewares/error-handler.middleware'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { Role } from '@prisma/client'
import { validateCreateShift } from '../../middlewares/data-validation/create/validate-create-shift.middleware'
import { validateUpdateShift } from '../../middlewares/data-validation/update/validate-update-shift.middleware'

const shiftRoutes = Router()

shiftRoutes.get('/', ShiftController.handleFindAll)
shiftRoutes.get('/employee/:id', ShiftController.handleFindByEmployeeId)
shiftRoutes.get('/:id', ShiftController.handleFindById)
shiftRoutes.post('/', routeAuthMiddleware([Role.EMPLOYEE, Role.MANAGER]), validateCreateShift, ShiftController.handleCreate)
shiftRoutes.put('/:id', routeAuthMiddleware([Role.EMPLOYEE, Role.MANAGER]), validateUpdateShift, ShiftController.handleUpdate)
shiftRoutes.delete('/:id', routeAuthMiddleware([Role.EMPLOYEE, Role.MANAGER]), ShiftController.handleDelete)
shiftRoutes.use(errorHandlerMiddleware)

export { shiftRoutes }
