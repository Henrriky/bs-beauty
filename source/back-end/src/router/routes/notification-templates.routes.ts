import { NotificationTemplatesController } from '@/controllers/notification-templates.controller'
import { userTypeAuthMiddleware } from '@/middlewares/auth/user-type-auth.middleware'
import { validateUpdateNotificationTemplate } from '@/middlewares/data-validation/notification-template/update-notification-template.validation.middleware'
import { validateQuery } from '@/middlewares/pagination/zod-request-validation.middleware'
import { notificationTemplateQuerySchema } from '@/utils/validation/zod-schemas/pagination/notification-templates/notification-templates-query.schema'
import { Router } from 'express'

const notificationTemplatesRoutes = Router()

notificationTemplatesRoutes.get('/', userTypeAuthMiddleware(['MANAGER']), validateQuery(notificationTemplateQuerySchema), NotificationTemplatesController.handleFindAll)
notificationTemplatesRoutes.put('/:key', userTypeAuthMiddleware(['MANAGER']), validateUpdateNotificationTemplate, NotificationTemplatesController.handleUpdate)
export { notificationTemplatesRoutes }
