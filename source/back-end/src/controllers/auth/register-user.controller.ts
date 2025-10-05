import { type NextFunction, type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { makeRegisterUserUseCase } from '../../factory/auth/make-register-user.use-case.factory'
import { CustomerSchemas } from '../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { formatValidationErrors } from '../../utils/formatting/zod-validation-errors.formatting.util'
import { z } from 'zod'
import { ProfessionalSchemas } from '../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'

class RegisterUserController {
  public static async handleRegisterCustomer (req: Request, res: Response, next: NextFunction) {
    try {
      const body = CustomerSchemas.registerCustomerBodySchema.parse(req.body)

      const usecase = makeRegisterUserUseCase()
      await usecase.executeRegisterCustomer(body)

      res.status(StatusCodes.OK).send({
        success: true,
        message: 'Verification code sent to provided email'
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

  public static async handleRegisterProfessional (req: Request, res: Response, next: NextFunction) {
    try {
      const body = ProfessionalSchemas.registerProfessionalBodySchema.parse(req.body)

      const useCase = makeRegisterUserUseCase()
      await useCase.executeRegisterProfessional(body)

      res.status(StatusCodes.CREATED).send({
        success: true,
        message: 'Professional registered successfully'
      })
    } catch (error: any) {
      console.error(`Error trying to register professional.\nReason: ${error?.message}`)
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res)
        return
      }
      next(error)
    }
  }

  public static async handleFindProfessionalByEmail (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeRegisterUserUseCase()
      const professional = await useCase.executeFindProfessionalByEmail(req.params.email)

      res.status(StatusCodes.OK).send({
        professional
      })
    } catch (error: any) {
      console.error(`Error trying to fetch professional.\nReason: ${error?.message}`)
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res)
        return
      }
      next(error)
    }
  }
}

export { RegisterUserController }
