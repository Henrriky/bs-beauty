import { z } from 'zod'
import { type Request, type Response, type NextFunction } from 'express'
import { RegexPatterns } from '../../../utils/validation/regex.validation.util'
import { SpecialFieldsValidation } from '../../../utils/validation/special-fields.validation.utils'
import { formatValidationErrors } from '../../../utils/formatting/format-validation-errors.formatting.util'
import { formatDate } from '../../../utils/formatting/format-date.formatting.util'

const createAppointmentServiceSchema = z.object({
  observation: z.string().min(3).refine((string) => RegexPatterns.content.test(string)).optional(),
  appointmentDate: z.date().refine((date) => !isNaN(date.getTime()) && date > new Date()),
  appointmentId: z.string().uuid(),
  serviceId: z.string().uuid()
})

const validateCreateAppointmentService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    SpecialFieldsValidation.verifyIdInBody(req)
    SpecialFieldsValidation.verifyStatus(req)
    req.body.appointmentDate = formatDate(req)
    createAppointmentServiceSchema.parse(req.body)
    console.log('PORRA')
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateCreateAppointmentService }
