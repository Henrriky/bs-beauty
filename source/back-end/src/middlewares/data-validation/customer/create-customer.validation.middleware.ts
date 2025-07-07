import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { DateFormatter } from '../../../utils/formatting/date.formatting.util'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'

const validateCreateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.body.birthdate = DateFormatter.formatBirthdate(req)
    CustomerSchemas.createSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateCreateCustomer }
