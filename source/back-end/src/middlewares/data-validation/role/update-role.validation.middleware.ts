import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { RoleSchemas } from '../../../utils/validation/zod-schemas/role.zod-schemas.validation.util'

const validateUpdateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    RoleSchemas.updateSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateUpdateRole }
