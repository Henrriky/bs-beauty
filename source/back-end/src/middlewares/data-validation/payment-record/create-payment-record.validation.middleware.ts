import { formatValidationErrors } from '@/utils/formatting/zod-validation-errors.formatting.util'
import { PaymentRecordSchemas } from '@/utils/validation/zod-schemas/payment-record.zod-schemas.validation.utils'
import { type NextFunction, type Request, type Response } from 'express'
import z from 'zod'

const validateCreatePaymentRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    PaymentRecordSchemas.createSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }

    next(error)
  }
}

export { validateCreatePaymentRecord }
