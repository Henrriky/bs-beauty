import { NextFunction, type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { makeRegisterCustomerUseCase } from '../../factory/auth/make-register-customer.use-case.factory'
import { CustomerSchemas } from '../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { formatValidationErrors } from '../../utils/formatting/zod-validation-errors.formatting.util'
import { z } from 'zod'

class RegisterCustomerController {
  public static async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const body = CustomerSchemas.registerCustomerBodySchema.parse(req.body)

      const usecase = makeRegisterCustomerUseCase()
      await usecase.execute(body)

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
}

export { RegisterCustomerController }
