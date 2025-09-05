import { NextFunction, type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { makeRegisterUserUseCase } from '../../factory/auth/make-register-user.use-case.factory'
import { CustomerSchemas } from '../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { formatValidationErrors } from '../../utils/formatting/zod-validation-errors.formatting.util'
import { z } from 'zod'
import { EmployeeSchemas } from '../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'

class RegisterUserController {
  public static async handleRegisterCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const body = CustomerSchemas.registerCustomerBodySchema.parse(req.body)

      const usecase = makeRegisterUserUseCase()
      await usecase.executeRegisterCustomer(body)

      res.status(StatusCodes.CREATED).send({
        success: true,
        message: 'Customer registered successfully'
      })
    } catch (error: any) {
      console.error(`Error trying to register customer.\nReason: ${error?.message}`)
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res)
        return
      }
      next(error)
    }
  }

  public static async handleRegisterEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const body = EmployeeSchemas.registerEmployeeBodySchema.parse(req.body)

      const useCase = makeRegisterUserUseCase()
      await useCase.executeRegisterEmployee(body)

      res.status(StatusCodes.CREATED).send({
        success: true,
        message: 'Employee registered successfully'
      })
    } catch (error: any) {
      console.error(`Error trying to register employee.\nReason: ${error?.message}`)
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res)
        return
      }
      next(error)
    }
  }

  public static async handleFindEmployeeByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeRegisterUserUseCase()
      const employee = await useCase.executeFindEmployeeByEmail(req.params.email)

      res.status(StatusCodes.OK).send({
        employee,
      })
    } catch (error: any) {
      console.error(`Error trying to fetch employee.\nReason: ${error?.message}`)
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res)
        return
      }
      next(error)
    }
  }
}

export { RegisterUserController }
