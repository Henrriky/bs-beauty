import { z } from 'zod'
import { type Request, type Response, type NextFunction } from 'express'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { RatingSchemas } from '@/utils/validation/zod-schemas/rating.zod-schemas.validation.utils'

const validateUpdateRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    RatingSchemas.updateSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateUpdateRating }
