import { Router } from 'express'
import { AppointmentServiceController } from '../../controllers/appointment-services.controller'
import { validateCreateAppointmentService } from '../../middlewares/data-validation/appointment-service/create-appointment-service.validation.middleware'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { Role } from '@prisma/client'
import { validateUpdateAppointmentService } from '../../middlewares/data-validation/appointment-service/update-appointment-service.validation.middleware'

const appointmentServiceRoutes = Router()

appointmentServiceRoutes.get('/', AppointmentServiceController.handleFindAll)
appointmentServiceRoutes.get('/date/:appointmentDate', AppointmentServiceController.handleFindByAppointmentDate)
appointmentServiceRoutes.get('/appointment/:appointmentId', AppointmentServiceController.handleFindByAppointmentId)
appointmentServiceRoutes.get('/offer/:serviceOfferedId', AppointmentServiceController.handleFindByServiceOfferedId)
appointmentServiceRoutes.get('/:id', AppointmentServiceController.handleFindById)
appointmentServiceRoutes.post('/', routeAuthMiddleware([Role.CUSTOMER]), validateCreateAppointmentService, AppointmentServiceController.handleCreate)
appointmentServiceRoutes.put('/:id', routeAuthMiddleware([Role.CUSTOMER, Role.EMPLOYEE, Role.MANAGER]), validateUpdateAppointmentService, AppointmentServiceController.handleUpdate)
appointmentServiceRoutes.delete('/:id', AppointmentServiceController.handleDelete)

export { appointmentServiceRoutes }
