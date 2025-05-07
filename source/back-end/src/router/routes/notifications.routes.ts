import { Router } from 'express'
import { NotificationsController } from '../../controllers/notifications.controller'

const notificationRoutes = Router()

notificationRoutes.get('/', NotificationsController.handleFindAll)
notificationRoutes.get('/user/:userId', NotificationsController.handleFindByUserId)
notificationRoutes.get('/:id', NotificationsController.handleFindById)
notificationRoutes.put('/:id/read', NotificationsController.handleMarkAsRead)
notificationRoutes.delete('/:id', NotificationsController.handleDelete)
notificationRoutes.post('/appointment/:appointmentId', NotificationsController.handleSendAppointmentNotification)

export { notificationRoutes }
