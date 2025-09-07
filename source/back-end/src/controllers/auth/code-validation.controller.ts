import { makeVerifyCustomerUseCase } from '@/factory/auth/make-verify-customer.use-case.factory'
import { formatValidationErrors } from '@/utils/formatting/zod-validation-errors.formatting.util'
import { NextFunction, type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

const CodeValidationBodySchema = z.object({
  purpose: z.enum(['register']).default('register'),
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

        // case 'password_reset': { ... }
        // case 'email_change': { ... }

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
