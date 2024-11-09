import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { DateFormatter } from '../../../utils/formatting/date.formatting.util'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'

const validateUpdateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requestBody = req.body
    if (requestBody.birthdate != null) {
      requestBody.birthdate = DateFormatter.formatBirthdate(req)
    }
    CustomerSchemas.updateSchema.parse(requestBody)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateUpdateCustomer }
