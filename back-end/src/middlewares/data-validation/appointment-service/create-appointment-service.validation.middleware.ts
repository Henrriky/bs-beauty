import { z } from 'zod'
import { type Request, type Response, type NextFunction } from 'express'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { AppointmentServiceSchemas } from '../../../utils/validation/zod-schemas/appointment-service.zod-schemas.validation.util'

const validateCreateAppointmentService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    AppointmentServiceSchemas.createSchema.parse(req.body)
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
