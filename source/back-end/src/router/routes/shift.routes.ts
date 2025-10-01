import { Router } from 'express'
import { ShiftController } from '../../controllers/shift.controller'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { UserType } from '@prisma/client'
import { validateCreateShift } from '../../middlewares/data-validation/shift/create-shift.validation.middleware'
import { validateUpdateShift } from '../../middlewares/data-validation/shift/update-shift.validation.middleware'

const shiftRoutes = Router()

shiftRoutes.get('/', ShiftController.handleFindAllByProfessionalId)
shiftRoutes.get('/professional/:id', ShiftController.handleFindByProfessionalId)
shiftRoutes.get('/:id', ShiftController.handleFindById)
shiftRoutes.post('/', routeAuthMiddleware([UserType.PROFESSIONAL, UserType.MANAGER]), validateCreateShift, ShiftController.handleCreate)
shiftRoutes.put('/:id', routeAuthMiddleware([UserType.PROFESSIONAL, UserType.MANAGER]), validateUpdateShift, ShiftController.handleUpdateByIdAndProfessionalId)
shiftRoutes.delete('/:id', routeAuthMiddleware([UserType.PROFESSIONAL, UserType.MANAGER]), ShiftController.handleDelete)

export { shiftRoutes }
