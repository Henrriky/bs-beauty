import { type Request, type Response, type NextFunction } from 'express'
import { WeekDays } from '@prisma/client'
import { z } from 'zod'
import { RegexPatterns } from '../../../utils/validation/regex.validation.util'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { SpecialFieldsValidation } from '../../../utils/validation/special-fields.validation.utils'
import { DateFormatter } from '../../../utils/formatting/date.formatting.util'

const updateShiftSchema = z.object({
  weekDay: z.nativeEnum(WeekDays).optional(),
  isBusy: z.boolean().optional(),
  shiftStart: z.string().refine((string) => RegexPatterns.time.test(string)).optional(),
  shiftEnd: z.string().refine((string) => RegexPatterns.time.test(string)).optional()
})

const validateUpdateShift = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    SpecialFieldsValidation.verifyIdInBody(req)
    SpecialFieldsValidation.verifyEmployeeId(req)
    updateShiftSchema.parse(req.body)
    req.body.shiftStart = DateFormatter.formatShiftStart(req)
    req.body.shiftEnd = DateFormatter.formatShiftEnd(req)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateUpdateShift }
