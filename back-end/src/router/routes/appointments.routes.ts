import { Router } from 'express'
import { AppointmentController } from '../../controllers/appointments.controller'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { Role } from '@prisma/client'
import { validateCreateAppointment } from '../../middlewares/data-validation/appointment/create-appointment.validation.middleware'
import { validateUpdateAppointment } from '../../middlewares/data-validation/appointment/update-appointment.validation.middleware'

const appointmentRoutes = Router()

appointmentRoutes.get('/', AppointmentController.handleFindAll)
appointmentRoutes.get('/customer/:customerId', AppointmentController.handleFindByCustomerId)
appointmentRoutes.get('/:id', AppointmentController.handleFindById)
appointmentRoutes.post('/', routeAuthMiddleware([Role.CUSTOMER]), routeAuthMiddleware([Role.CUSTOMER, Role.EMPLOYEE, Role.MANAGER]), validateCreateAppointment, AppointmentController.handleCreate)
appointmentRoutes.put('/:id', routeAuthMiddleware([Role.CUSTOMER, Role.EMPLOYEE, Role.MANAGER]), validateUpdateAppointment, AppointmentController.handleUpdate)
appointmentRoutes.delete('/:id', AppointmentController.handleDelete)

export { appointmentRoutes }
