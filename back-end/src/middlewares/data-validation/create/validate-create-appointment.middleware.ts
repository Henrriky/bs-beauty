import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { SpecialFieldsValidation } from '../../../utils/validation/special-fields.validation.utils'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { Status } from '@prisma/client'
import { RegexPatterns } from '../../../utils/validation/regex.validation.util'

const createAppointmentSchema = z.object({
  observation: z.string().min(3).refine((string) => RegexPatterns.content.test(string)).optional(),
  status: z.enum([Status.CANCELLED, Status.CONFIRMED, Status.FINISHED, Status.NO_SHOW, Status.PENDING, Status.RESCHEDULED]).optional(),
  customerId: z.string().uuid()
})

const validateCreateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const roles = ['MANAGER', 'EMPLOYEE']
    SpecialFieldsValidation.verifyIdInBody(req)
    SpecialFieldsValidation.verifyTimestampsInBody(req)
    if (req.headers.role !== 'CUSTOMER') {
      SpecialFieldsValidation.verifyObservation(req)
      SpecialFieldsValidation.verifyCustomerId(req)
    }
    if (!roles.includes(req.headers.role as string)) {
      SpecialFieldsValidation.verifyStatus(req)
    }
    createAppointmentSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateCreateAppointment }
