import { Router } from 'express'
import { serviceRoutes } from './routes/services.routes'
import { customerRoutes } from './routes/customers.routes'
import { employeeRoutes } from './routes/employees.routes'
import { notificationRoutes } from './routes/notifications.routes'
import { appointmentRoutes } from './routes/appointments.routes'
import { appointmentServiceRoutes } from './routes/appointment-services.routes'
import { shiftRoutes } from './routes/shift.routes'

const appRoutes = Router()

appRoutes.use('/employees', employeeRoutes)
appRoutes.use('/services', serviceRoutes)
appRoutes.use('/customers', customerRoutes)
appRoutes.use('/notifications', notificationRoutes)
appRoutes.use('/appointments', appointmentRoutes)
appRoutes.use('/appointment-services', appointmentServiceRoutes)
appRoutes.use('/shifts', shiftRoutes)

export { appRoutes }
