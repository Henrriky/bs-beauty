import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { NotificationSchemas } from '../../../utils/validation/zod-schemas/notification.zod-schemas.validation.util'

const validateCreateNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    NotificationSchemas.createSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateCreateNotification }
