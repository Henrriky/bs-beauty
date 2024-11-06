import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/format-validation-errors.formatting.util'
import { formatDate } from '../../../utils/formatting/format-date.formatting.util'
import { SpecialFieldsValidation } from '../../../utils/validation/special-fields.validation.utils'

const createCustomerSchema = z.object({
  name: z.string().min(3).refine((string) => /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(string)),
  birthdate: z.date().refine((date) => !isNaN(date.getTime()) && date < new Date()),
  email: z.string().email(),
  phone: z.string().refine((value) => /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(value))
})

const validateCreateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await SpecialFieldsValidation.verifyIdInBody(req)
    await SpecialFieldsValidation.verifyRoleInBody(req)
    await SpecialFieldsValidation.verifyTimestampsInBody(req)
    req.body.birthdate = formatDate(req)
    createCustomerSchema.parse(req.body)
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
