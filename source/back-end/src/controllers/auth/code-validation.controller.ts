import { makeVerifyCustomerUseCase } from '@/factory/auth/make-verify-customer.use-case.factory'
import { makeVerifyPasswordResetUseCase } from '@/factory/auth/make-verify-password-reset.use-case.factory'
import { formatValidationErrors } from '@/utils/formatting/zod-validation-errors.formatting.util'
import { NextFunction, type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

const CodeValidationBodySchema = z.object({
  purpose: z.enum(['register', 'passwordReset']).default('register'),
  email: z.string().email(),
  code: z.string().min(6).max(6),
})

class CodeValidationController {
  public static async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { purpose, email, code } = CodeValidationBodySchema.parse(req.body)

      switch (purpose) {
        case 'register': {
          const useCase = makeVerifyCustomerUseCase()
          const result = await useCase.execute({ email, code })
          return res.status(StatusCodes.CREATED).json({
            success: true,
            ...result,
          })
        }
        case 'passwordReset': {
          const useCase = makeVerifyPasswordResetUseCase()
          const { ticket } = await useCase.execute({ email, code })
          return res.status(StatusCodes.OK).json({
            success: true,
            ticket,
            message: 'Code verified. You may now set a new password.'
          })
        }

        default:
          return res.status(StatusCodes.NOT_IMPLEMENTED).json({
            success: false,
            message: `Purpose '${purpose}' not implemented`,
          })
      }

    } catch (error: any) {
      console.error(`Error trying to complete user register.\nReason: ${error?.message}`);
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res)
        return
      }
      next(error);
    }
  }
}

export { CodeValidationController }
