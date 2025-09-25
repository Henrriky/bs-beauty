import { formatValidationErrors } from '@/utils/formatting/zod-validation-errors.formatting.util'
import { SalonInfoSchemas } from '@/utils/validation/zod-schemas/salon-info.zod-schemas.validation.utils'
import { type NextFunction, type Request, type Response } from 'express'
import z from 'zod'

const validateUpdateSalonInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    SalonInfoSchemas.updateSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateUpdateSalonInfo }
