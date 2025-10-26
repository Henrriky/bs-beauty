import { Router } from 'express'
import { AppointmentController } from '../../controllers/appointments.controller'
import { userTypeAuthMiddleware } from '../../middlewares/auth/user-type-auth.middleware'
import { UserType } from '@prisma/client'
import { validateCreateAppointment } from '../../middlewares/data-validation/appointment/create-appointment.validation.middleware'
import { validateUpdateAppointment } from '../../middlewares/data-validation/appointment/update-appointment.validation.middleware'
import { appointmentsQuerySchema } from '@/utils/validation/zod-schemas/pagination/appointments/appointments-query.schema'
import { validateQuery } from '@/middlewares/pagination/zod-request-validation.middleware'

const appointmentRoutes = Router()

appointmentRoutes.get(
  '/',
  userTypeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL, UserType.MANAGER]),
  validateQuery(appointmentsQuerySchema),
  AppointmentController.handleFindAll
)
appointmentRoutes.get('/customer', userTypeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL, UserType.MANAGER]), AppointmentController.handleFindByCustomerOrProfessionalId)
appointmentRoutes.get('/offer/:serviceOfferedId', AppointmentController.handleFindByServiceOfferedId)
appointmentRoutes.get('/:id', AppointmentController.handleFindById)
appointmentRoutes.post('/', userTypeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL, UserType.MANAGER]), validateCreateAppointment, AppointmentController.handleCreate)
appointmentRoutes.put('/:id', userTypeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL, UserType.MANAGER]), validateUpdateAppointment, AppointmentController.handleUpdate)
appointmentRoutes.put('/:id/finish', userTypeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL]), validateUpdateAppointment, AppointmentController.handleFinishAppointment)
appointmentRoutes.delete('/:id', AppointmentController.handleDelete)

export { appointmentRoutes }
