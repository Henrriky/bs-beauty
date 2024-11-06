import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/format-validation-errors.formatting.util'

const updateServiceSchema = z.object({
  name: z.string().min(3).refine((string) => /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(string)).optional(),
  description: z.string().min(2).refine((string) => /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(string)).optional(),
  category: z.string().min(2).refine((string) => /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(string)).optional()
})

const validateUpdateService = (req: Request, res: Response, next: NextFunction): void => {
  try {
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
