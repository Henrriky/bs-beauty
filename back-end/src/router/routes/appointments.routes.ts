import { Router } from 'express'
import { AppointmentController } from '../../controllers/appointments.controller'
import { errorHandlerMiddleware } from '../../middlewares/error-handler.middleware'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { Role } from '@prisma/client'
import { validateCreateAppointment } from '../../middlewares/data-validation/create/validate-create-appointment.middleware'
import { validateUpdateAppointment } from '../../middlewares/data-validation/update/validate-update-appointment.middleware'

const appointmentRoutes = Router()

appointmentRoutes.get('/', AppointmentController.handleFindAll)
appointmentRoutes.get('/customer/:customerId', AppointmentController.handleFindByCustomerId)
appointmentRoutes.get('/:id', AppointmentController.handleFindById)
appointmentRoutes.post('/', routeAuthMiddleware([Role.CUSTOMER]), routeAuthMiddleware([Role.CUSTOMER, Role.EMPLOYEE, Role.MANAGER]), validateCreateAppointment, AppointmentController.handleCreate)
appointmentRoutes.put('/:id', routeAuthMiddleware([Role.CUSTOMER, Role.EMPLOYEE, Role.MANAGER]), validateUpdateAppointment, AppointmentController.handleUpdate)
appointmentRoutes.delete('/:id', AppointmentController.handleDelete)
appointmentRoutes.use(errorHandlerMiddleware)

export { appointmentRoutes }
