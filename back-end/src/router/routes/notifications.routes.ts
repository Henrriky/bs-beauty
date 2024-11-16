import { Router } from 'express'
import { NotificationsController } from '../../controllers/notifications.controller'
import { validateCreateNotification } from '../../middlewares/data-validation/notification/create-notification.validation.middleware'

const notificationRoutes = Router()

notificationRoutes.get('/', NotificationsController.handleFindAll)
notificationRoutes.get('/user/:userId', NotificationsController.handleFindByUserId)
notificationRoutes.get('/:id', NotificationsController.handleFindById)
notificationRoutes.post('/', validateCreateNotification, NotificationsController.handleCreate)
notificationRoutes.put('/:id/read', NotificationsController.handleMarkAsRead)
notificationRoutes.delete('/:id', NotificationsController.handleDelete)

export { notificationRoutes }
