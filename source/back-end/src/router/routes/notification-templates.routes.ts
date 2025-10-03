import { NotificationTemplatesController } from '@/controllers/notification-templates.controller'
import { validateUpdateNotificationTemplate } from '@/middlewares/data-validation/notification-template/update-notification-template.validation.middleware'
import { validateQuery } from '@/middlewares/pagination/zod-request-validation.middleware'
import { routeAuthMiddleware } from '@/middlewares/route-auth.middleware'
import { notificationTemplateQuerySchema } from '@/utils/validation/zod-schemas/pagination/notification-templates/notification-templates-query.schema'
import { Router } from 'express'

const notificationTemplatesRoutes = Router()

notificationTemplatesRoutes.get('/', routeAuthMiddleware(['MANAGER']), validateQuery(notificationTemplateQuerySchema), NotificationTemplatesController.handleFindAll)
notificationTemplatesRoutes.put('/:key', routeAuthMiddleware(['MANAGER']), validateUpdateNotificationTemplate, NotificationTemplatesController.handleUpdate)
export { notificationTemplatesRoutes }
