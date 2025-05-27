import { type Request, type Response, type NextFunction } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { DateFormatter } from '../../../utils/formatting/date.formatting.util'
import { ShiftSchemas } from '../../../utils/validation/zod-schemas/shift.zod-schemas.validation.util'

const validateCreateShift = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requestBody = req.body
    ShiftSchemas.createSchema.parse(requestBody)
    requestBody.shiftStart = DateFormatter.formatShiftStart(req)
    requestBody.shiftEnd = DateFormatter.formatShiftEnd(req)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateCreateShift }
