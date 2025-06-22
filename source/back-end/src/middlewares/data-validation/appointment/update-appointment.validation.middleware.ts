import { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { AppointmentSchemas } from '../../../utils/validation/zod-schemas/appointment.zod-schemas.validation.utils'
import { UserType } from '@prisma/client'

const validateUpdateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userTypes: UserType[] = [UserType.MANAGER, UserType.EMPLOYEE]
    const userType = req.headers.userType as UserType
    const requestBody = req.body

    if (userType === UserType.CUSTOMER) {
      AppointmentSchemas.customerUpdateSchema.parse(requestBody)
    }

    if (userTypes.includes(userType)) {
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
