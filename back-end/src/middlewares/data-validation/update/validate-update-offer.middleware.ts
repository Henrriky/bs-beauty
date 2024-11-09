import { z } from 'zod'
import { type Request, type Response, type NextFunction } from 'express'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'

const updateOfferSchema = z.object({
  estimatedTime: z.number().int().optional(),
  price: z.number().multipleOf(0.01).optional(),
  isOffering: z.boolean().optional()
}).strict()

const validateUpdateOffer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    updateOfferSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateUpdateOffer }
