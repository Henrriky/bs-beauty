import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { ServiceSchemas } from '../../../utils/validation/zod-schemas/service.zod-schemas.validation.utils'

const validateUpdateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    ServiceSchemas.updateSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateUpdateService }
