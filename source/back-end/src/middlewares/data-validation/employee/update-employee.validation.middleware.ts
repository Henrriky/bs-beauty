import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { EmployeeSchemas } from '../../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'
import { Role } from '@prisma/client'

const validateUpdateEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const role = req.headers.role as Role
    const requestBody = req.body

    if (role === Role.MANAGER) {
      EmployeeSchemas.managerUpdateSchema.parse(requestBody)
    }

    if (role === Role.EMPLOYEE) {
      EmployeeSchemas.employeeUpdateSchema.parse(requestBody)
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

export { validateUpdateEmployee }
