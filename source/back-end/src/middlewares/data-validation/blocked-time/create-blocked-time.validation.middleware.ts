import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { BlockedTimeSchemas } from '@/utils/validation/zod-schemas/blocked-time.zod-schemas.validation.util'

const validateCreateBlockedTime = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    BlockedTimeSchemas.createSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateCreateBlockedTime }
