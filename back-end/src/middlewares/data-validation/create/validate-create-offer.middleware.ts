import { z } from 'zod'
import { type Request, type Response, type NextFunction } from 'express'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'

const createOfferSchema = z.object({
  estimatedTime: z.number().int(),
  price: z.number().multipleOf(0.01),
  isOffering: z.boolean(),
  serviceId: z.string().uuid(),
  employeeId: z.string().uuid()
}).strict()

const validateCreateOffer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    createOfferSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateCreateOffer }
