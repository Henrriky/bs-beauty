import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { formatDate } from '../../../utils/formatting/date.formatting.util'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { SpecialFieldsValidation } from '../../../utils/validation/special-fields.validation.utils'
import { RegexPatterns } from '../../../utils/validation/regex.validation.util'

const updateCustomerSchema = z.object({
  name: z.string().min(3).refine((string) => RegexPatterns.names.test(string)).optional(),
  birthdate: z.date().refine((date) => !isNaN(date.getTime()) && date < new Date()).optional(),
  email: z.string().email().optional(),
  phone: z.string().refine((value) => RegexPatterns.phone.test(value)).optional()
})

const validateUpdateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    SpecialFieldsValidation.verifyIdInBody(req)
    SpecialFieldsValidation.verifyRoleInBody(req)
    SpecialFieldsValidation.verifyTimestampsInBody(req)
    if (req.body.birthdate != null) {
      req.body.birthdate = formatDate(req)
    }
    updateCustomerSchema.parse(req.body)
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
