import { Router } from 'express'
import { NotificationsController } from '../../controllers/notifications.controller'
import { errorHandlerMiddleware } from '../../middlewares/error-handler.middleware'
import { validateCreateNotification } from '../../middlewares/data-validation/create/validate-create-notification.middleware'

const notificationRoutes = Router()

notificationRoutes.get('/', NotificationsController.handleFindAll)
notificationRoutes.get('/user/:userId', NotificationsController.handleFindByUserId)
notificationRoutes.get('/:id', NotificationsController.handleFindById)
notificationRoutes.post('/', validateCreateNotification, NotificationsController.handleCreate)
notificationRoutes.put('/:id/read', NotificationsController.handleMarkAsRead)
notificationRoutes.delete('/:id', NotificationsController.handleDelete)
notificationRoutes.use(errorHandlerMiddleware)

export { notificationRoutes }
