import { z } from 'zod'
import { type Request, type Response, type NextFunction } from 'express'
import { RegexPatterns } from '../../../utils/validation/regex.validation.util'
import { SpecialFieldsValidation } from '../../../utils/validation/special-fields.validation.utils'
import { formatValidationErrors } from '../../../utils/formatting/format-validation-errors.formatting.util'
import { formatDate } from '../../../utils/formatting/format-date.formatting.util'
import { Role, Status } from '@prisma/client'

const updateAppointmentServiceSchema = z.object({
  observation: z.string().min(3).refine((string) => RegexPatterns.content.test(string)).optional(),
  status: z.nativeEnum(Status).optional(),
  appointmentDate: z.date().refine((date) => !isNaN(date.getTime()) && date < new Date()).optional()
})

const validateUpdateAppointmentService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const roles: Role[] = [Role.MANAGER, Role.EMPLOYEE]
    const role = req.headers.role as Role
    SpecialFieldsValidation.verifyIdInBody(req)
    SpecialFieldsValidation.verifyAppointmentId(req)
    SpecialFieldsValidation.verifyServiceId(req)
    if (role !== Role.CUSTOMER) {
      SpecialFieldsValidation.verifyObservation(req)
    }
    if (!roles.includes(role)) {
      SpecialFieldsValidation.verifyStatus(req)
    }
    req.body.appointmentDate = formatDate(req)
    updateAppointmentServiceSchema.parse(req)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateUpdateAppointmentService }
