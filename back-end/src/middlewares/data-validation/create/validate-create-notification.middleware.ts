import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { SpecialFieldsValidation } from '../../../utils/validation/special-fields.validation.utils'
import { formatValidationErrors } from '../../../utils/formatting/format-validation-errors.formatting.util'

const createNotificationSchema = z.object({
  title: z.string().min(3).refine((string) => /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(string)),
  content: z.string().min(3).refine((string) => /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(string)),
  employeeId: z.string().uuid().optional().nullable(),
  customerId: z.string().uuid().optional().nullable()
})

const validateCreateNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    SpecialFieldsValidation.verifyIdInBody(req)
    SpecialFieldsValidation.verifySingleIdDestinationInNotification(req)
    SpecialFieldsValidation.verifyTimestampsInBody(req)
    createNotificationSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateCreateNotification }
