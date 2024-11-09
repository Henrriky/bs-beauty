import { Router } from 'express'
import { ShiftController } from '../../controllers/shift.controller'
import { errorHandlerMiddleware } from '../../middlewares/error-handler.middleware'

const shiftRoutes = Router()

shiftRoutes.get('/', ShiftController.handleFindAll)
shiftRoutes.get('/employee:id', ShiftController.handleFindByEmployeeId)
shiftRoutes.get('/:id', ShiftController.handleFindById)
shiftRoutes.post('/', ShiftController.handleCreate)
shiftRoutes.put('/:id', ShiftController.handleUpdate)
shiftRoutes.delete('/:id', ShiftController.handleDelete)
shiftRoutes.use(errorHandlerMiddleware)

export { shiftRoutes }
