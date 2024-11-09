import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { SpecialFieldsValidation } from '../../../utils/validation/special-fields.validation.utils'
import { RegexPatterns } from '../../../utils/validation/regex.validation.util'

const updateServiceSchema = z.object({
  name: z.string().min(3).refine((string) => RegexPatterns.names.test(string)).optional(),
  description: z.string().min(2).refine((string) => RegexPatterns.content.test(string)).optional(),
  category: z.string().min(2).refine((string) => RegexPatterns.names.test(string)).optional()
})

const validateUpdateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    SpecialFieldsValidation.verifyIdInBody(req)
    SpecialFieldsValidation.verifyTimestampsInBody(req)
    updateServiceSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateUpdateService }
