import { Router } from 'express'
import { ShiftController } from '../../controllers/shift.controller'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { UserType } from '@prisma/client'
import { validateCreateShift } from '../../middlewares/data-validation/shift/create-shift.validation.middleware'
import { validateUpdateShift } from '../../middlewares/data-validation/shift/update-shift.validation.middleware'

const shiftRoutes = Router()

shiftRoutes.get('/', ShiftController.handleFindAllByEmployeeId)
shiftRoutes.get('/employee/:id', ShiftController.handleFindByEmployeeId)
shiftRoutes.get('/:id', ShiftController.handleFindById)
shiftRoutes.post('/', routeAuthMiddleware([UserType.EMPLOYEE, UserType.MANAGER]), validateCreateShift, ShiftController.handleCreate)
shiftRoutes.put('/:id', routeAuthMiddleware([UserType.EMPLOYEE, UserType.MANAGER]), validateUpdateShift, ShiftController.handleUpdateByIdAndEmployeeId)
shiftRoutes.delete('/:id', routeAuthMiddleware([UserType.EMPLOYEE, UserType.MANAGER]), ShiftController.handleDelete)

export { shiftRoutes }
