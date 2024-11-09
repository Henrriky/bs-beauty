import { Router } from 'express'
import { AppointmentServiceController } from '../../controllers/appointment-services.controller'
import { errorHandlerMiddleware } from '../../middlewares/error-handler.middleware'
import { validateCreateAppointmentService } from '../../middlewares/data-validation/create/validate-create-appointment-service.middleware'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { Role } from '@prisma/client'
import { validateUpdateAppointmentService } from '../../middlewares/data-validation/update/validate-update-appointment-service.middleware'

const appointmentServiceRoutes = Router()

appointmentServiceRoutes.get('/', AppointmentServiceController.handleFindAll)
appointmentServiceRoutes.get('/date/:appointmentDate', AppointmentServiceController.handleFindByAppointmentDate)
appointmentServiceRoutes.get('/appointment/:appointmentId', AppointmentServiceController.handleFindByAppointmentId)
appointmentServiceRoutes.get('/service/:serviceId', AppointmentServiceController.handleFindByServiceId)
appointmentServiceRoutes.get('/:id', AppointmentServiceController.handleFindById)
appointmentServiceRoutes.post('/', routeAuthMiddleware([Role.CUSTOMER]), validateCreateAppointmentService, AppointmentServiceController.handleCreate)
appointmentServiceRoutes.put('/:id', routeAuthMiddleware([Role.CUSTOMER, Role.EMPLOYEE, Role.MANAGER]), validateUpdateAppointmentService, AppointmentServiceController.handleUpdate)
appointmentServiceRoutes.delete('/:id', AppointmentServiceController.handleDelete)
appointmentServiceRoutes.use(errorHandlerMiddleware)

export { appointmentServiceRoutes }
