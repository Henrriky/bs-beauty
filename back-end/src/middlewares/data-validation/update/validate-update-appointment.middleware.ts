import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { SpecialFieldsValidation } from '../../../utils/validation/special-fields.validation.utils'
import { formatValidationErrors } from '../../../utils/formatting/format-validation-errors.formatting.util'
import { Status } from '@prisma/client'

const updateAppointmentSchema = z.object({
  observation: z.string().min(3).refine((string) => /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(string)).optional(),
  status: z.enum([Status.CANCELLED, Status.CONFIRMED, Status.FINISHED, Status.NO_SHOW, Status.PENDING, Status.RESCHEDULED]).optional()
})

const validateUpdateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const roles = ['MANAGER', 'EMPLOYEE']
    SpecialFieldsValidation.verifyIdInBody(req)
    SpecialFieldsValidation.verifyTimestampsInBody(req)
    SpecialFieldsValidation.verifyCustomerId(req)
    if (req.headers.role !== 'CUSTOMER') {
      SpecialFieldsValidation.verifyObservation(req)
    }
    if (!roles.includes(req.headers.role as string)) {
      SpecialFieldsValidation.verifyStatus(req)
    }
    updateAppointmentSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateUpdateAppointment }
