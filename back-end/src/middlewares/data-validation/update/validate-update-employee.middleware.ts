import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/format-validation-errors.formatting.util'
import { SpecialFieldsValidation } from '../../../utils/validation/special-fields.validation.utils'

const socialMediaSchema = z.object({
  name: z.string(),
  url: z.string().refine((value) => /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/.test(value))
})

const updateEmployeeSchema = z.object({
  name: z.string().min(3).refine((string) => /^[^\d]*$/.test(string)).optional(),
  email: z.string().email().optional(),
  passwordHash: z.string().refine((pass) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass)).optional(),
  socialMedia: socialMediaSchema.optional(),
  contact: z.string().refine((value) => /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(value)).optional(),
  role: z.enum(['MANAGER', 'EMPLOYEE']).optional()
})

const validateUpdateEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    SpecialFieldsValidation.verifyIdInBody(req)
    if (req.headers.role !== 'MANAGER') {
      SpecialFieldsValidation.verifyRoleInBody(req)
    }
    SpecialFieldsValidation.verifyTimestampsInBody(req)

    updateEmployeeSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateUpdateEmployee }
