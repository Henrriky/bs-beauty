import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { AppointmentSchemas } from '../../../utils/validation/zod-schemas/appointment.zod-schemas.validation.utils'
import { Role } from '@prisma/client'

const validateUpdateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const roles: Role[] = [Role.MANAGER, Role.EMPLOYEE]
    const role = req.headers.role as Role
    const requestBody = req.body

    if (role === Role.CUSTOMER) {
      AppointmentSchemas.customerUpdateSchema.parse(requestBody)
    }

    if (roles.includes(role)) {
      AppointmentSchemas.employeeUpdateSchema.parse(requestBody)
    }

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
