import { Router } from 'express'
import { AppointmentController } from '../../controllers/appointments.controller'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { UserType } from '@prisma/client'
import { validateCreateAppointment } from '../../middlewares/data-validation/appointment/create-appointment.validation.middleware'
import { validateUpdateAppointment } from '../../middlewares/data-validation/appointment/update-appointment.validation.middleware'

const appointmentRoutes = Router()

appointmentRoutes.get('/', AppointmentController.handleFindAll)
appointmentRoutes.get('/customer', routeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL, UserType.MANAGER]), AppointmentController.handleFindByCustomerOrProfessionalId)
appointmentRoutes.get('/offer/:serviceOfferedId', AppointmentController.handleFindByServiceOfferedId)
appointmentRoutes.get('/:id', AppointmentController.handleFindById)
appointmentRoutes.post('/', routeAuthMiddleware([UserType.CUSTOMER]), routeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL, UserType.MANAGER]), validateCreateAppointment, AppointmentController.handleCreate)
appointmentRoutes.put('/:id', routeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL, UserType.MANAGER]), validateUpdateAppointment, AppointmentController.handleUpdate)
appointmentRoutes.delete('/:id', AppointmentController.handleDelete)

export { appointmentRoutes }
