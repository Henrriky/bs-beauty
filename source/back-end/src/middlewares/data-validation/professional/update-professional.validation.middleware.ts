import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { formatValidationErrors } from '../../../utils/formatting/zod-validation-errors.formatting.util'
import { ProfessionalSchemas } from '../../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'
import { UserType } from '@prisma/client'

const validateUpdateProfessional = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userType = req.headers.userType as UserType
    const requestBody = req.body

    if (userType === UserType.MANAGER) {
      ProfessionalSchemas.managerUpdateSchema.parse(requestBody)
    }

    if (userType === UserType.PROFESSIONAL) {
      ProfessionalSchemas.professionalUpdateSchema.parse(requestBody)
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

export { validateUpdateProfessional }
