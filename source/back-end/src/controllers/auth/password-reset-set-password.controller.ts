import { makePasswordResetSetPasswordUseCase } from '@/factory/auth/make-password-reset-set-password-use-case.factory'
import { formatValidationErrors } from '@/utils/formatting/zod-validation-errors.formatting.util'
import { PasswordResetSetPasswordSchema } from '@/utils/validation/zod-schemas/auth/password-reset-set-password.schema'
import { type NextFunction, type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

class PasswordResetSetPasswordController {
  public static async handle (req: Request, res: Response, next: NextFunction) {
    try {
      const { ticket, newPassword } = PasswordResetSetPasswordSchema.parse(req.body)
      const usecase = makePasswordResetSetPasswordUseCase()
      await usecase.execute({ ticket, newPassword })

      res.status(StatusCodes.OK).send({
        success: true,
        message: 'Password changed successfully'
      })
    } catch (error: any) {
      console.error(`Error setting new password.\nReason: ${error?.message}`)
      if (error instanceof z.ZodError) { formatValidationErrors(error, res); return }
      next(error)
    }
  }
}
export { PasswordResetSetPasswordController }
