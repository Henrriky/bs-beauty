/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { formatValidationErrors } from '../../utils/formatting/zod-validation-errors.formatting.util'
import { EmployeeSchemas } from '../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'
import { CustomerSchemas } from '../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { makeCompleteUserRegisterUseCase } from '../../factory/auth/make-complete-user-register.use-case.factory'
import { UserType } from '@prisma/client'
import { InvalidUserTypeUseCaseError } from '../../services/use-cases/errors/invalid-user-type-use-case-error'

const userTypesToSchemas = {
  [UserType.CUSTOMER]: CustomerSchemas.customerCompleteRegisterBodySchema,
  [UserType.EMPLOYEE]: EmployeeSchemas.employeeCompleteRegisterBodySchema,
  [UserType.MANAGER]: EmployeeSchemas.employeeCompleteRegisterBodySchema
}

class CompleteUserRegisterController {
  public static async handle (req: Request, res: Response) {
    try {
      if (req.user.registerCompleted) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'User already complete register' })
        return
      }

      const schema = userTypesToSchemas[req.user.userType]

      if (!schema) {
        throw new InvalidUserTypeUseCaseError(`Invalid user type provided: ${req.user.userType}`)
      }

      const customerOrEmployee = schema.parse(req.body)

      if (!req.user.sub) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'User ID is missing' })
        return
      }

      const usecase = makeCompleteUserRegisterUseCase()

      await usecase.execute({
        userData: customerOrEmployee,
        userId: req.user.sub,
        userType: req.user.userType,
        userEmail: req.user.email
      })

      res.status(StatusCodes.NO_CONTENT).send()
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res)
        return
      }
      if (error instanceof InvalidUserTypeUseCaseError) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: error.message })
        return
      }
      console.error(`Error trying to complete user register.\nReason: ${error?.message}`)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error trying to complete user register, please check back-end logs...' })
    }
  }
}

export { CompleteUserRegisterController }
