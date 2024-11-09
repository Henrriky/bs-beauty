import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { SpecialFieldsValidation } from '../../../utils/validation/special-fields.validation.utils'
import { RegexPatterns } from '../../../utils/validation/regex.validation.util'

const socialMediaSchema = z.object({
  name: z.string(),
  url: z.string().refine((value) => RegexPatterns.url.test(value))
})

const updateEmployeeSchema = z.object({
  name: z.string().min(3).refine((string) => RegexPatterns.names.test(string)).optional(),
  email: z.string().email().optional(),
  passwordHash: z.string().refine((pass) => RegexPatterns.password.test(pass)).optional(),
  socialMedia: socialMediaSchema.optional(),
  contact: z.string().refine((value) => RegexPatterns.phone.test(value)).optional(),
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
