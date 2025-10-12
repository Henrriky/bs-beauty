import { NotificationTemplateSchemas } from '@/utils/validation/zod-schemas/notification-template.zod-schemas.validation.util'
import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'

const validateUpdateNotificationTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requestBody = req.body

    NotificationTemplateSchemas.updateSchema.parse(requestBody)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateUpdateNotificationTemplate }
