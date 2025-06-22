import type { NextFunction, Request, Response } from 'express'
import { ZodError, type ZodSchema } from 'zod'
import { formatValidationErrors } from '../../utils/formatting/zod-validation-errors.formatting.util'

export function validateQuery (schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.query)
      req.query = parsed
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        formatValidationErrors(error, res)
        return
      }
      next(error)
    }
  }
}
