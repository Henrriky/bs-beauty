import { Router } from 'express'
import { NotificationsController } from '../../controllers/notifications.controller'
import { UserType } from '@prisma/client'
import { notificationQuerySchema } from '@/utils/validation/zod-schemas/pagination/notifications/notifications-query.schema'
import { validateQuery } from '@/middlewares/pagination/zod-request-validation.middleware'
import { userTypeAuthMiddleware } from '@/middlewares/auth/user-type-auth.middleware'

const notificationRoutes = Router()

notificationRoutes.get(
  '/',
  userTypeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL, UserType.MANAGER]),
  validateQuery(notificationQuerySchema),
  NotificationsController.handleFindAll
)
notificationRoutes.get('/:id', NotificationsController.handleFindById)
notificationRoutes.delete('/:id', NotificationsController.handleDelete)
notificationRoutes.put(
  '/read',
  userTypeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL, UserType.MANAGER]),
  NotificationsController.handleMarkManyAsRead
)
export { notificationRoutes }
