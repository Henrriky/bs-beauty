import { Router } from 'express'
import { NotificationsController } from '../../controllers/notifications.controller'
import { routeAuthMiddleware } from '@/middlewares/route-auth.middleware'
import { UserType } from '@prisma/client'
import { notificationQuerySchema } from '@/utils/validation/zod-schemas/pagination/notifications/notifications-query.schema'
import { validateQuery } from '@/middlewares/pagination/zod-request-validation.middleware'

const notificationRoutes = Router()

notificationRoutes.get(
  '/',
  routeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL, UserType.MANAGER]),
  validateQuery(notificationQuerySchema),
  NotificationsController.handleFindAll
)
notificationRoutes.get('/:id', NotificationsController.handleFindById)
notificationRoutes.delete('/:id', NotificationsController.handleDelete)
notificationRoutes.put(
  '/read',
  routeAuthMiddleware([UserType.CUSTOMER, UserType.PROFESSIONAL, UserType.MANAGER]),
  NotificationsController.handleMarkManyAsRead
)
export { notificationRoutes }
