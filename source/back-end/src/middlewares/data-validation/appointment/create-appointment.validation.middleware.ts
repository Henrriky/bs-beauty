import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { AppointmentSchemas } from '../../../utils/validation/zod-schemas/appointment.zod-schemas.validation.utils'

const validateCreateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.body.customerId = req.user.id
    AppointmentSchemas.createSchema.parse(req.body)
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
