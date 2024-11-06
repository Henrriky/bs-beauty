import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/format-validation-errors.formatting.util'
import { SpecialFieldsValidation } from '../../../utils/validation/special-fields.validation.utils'

const socialMediaSchema = z.object({
  name: z.string().min(1),
  url: z.string().refine((value) => /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/.test(value))
})

const createEmployeeSchema = z.object({
  name: z.string().min(3).refine((string) => /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(string)),
  email: z.string().email(),
  passwordHash: z.string().refine((pass) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass)),
  socialMedia: socialMediaSchema.optional(),
  contact: z.string().refine((value) => /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(value)).optional(),
  role: z.enum(['MANAGER', 'EMPLOYEE'])
})

const validateCreateEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await SpecialFieldsValidation.verifyIdInBody(req)
    if (req.headers.role !== 'MANAGER') {
      await SpecialFieldsValidation.verifyRoleInBody(req)
    }
    await SpecialFieldsValidation.verifyTimestampsInBody(req)
    createEmployeeSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateCreateEmployee }
