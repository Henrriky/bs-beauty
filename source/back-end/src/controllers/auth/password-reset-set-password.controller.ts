import { makePasswordResetSetPasswordUseCase } from '@/factory/auth/make-password-reset-set-password-use-case.factory'
import { formatValidationErrors } from '@/utils/formatting/zod-validation-errors.formatting.util'
import { RegexPatterns } from '@/utils/validation/regex.validation.util'
import { type NextFunction, type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

const PasswordResetSetPasswordSchema = z.object({
  ticket: z.string().min(10),
  newPassword: z.string()
    .regex(RegexPatterns.password, {
      message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and one special character (@$!%*?&).'
    }),
  confirmNewPassword: z.string()
    .regex(RegexPatterns.password, {
      message: 'Confirm password must follow the same rules as password.'
    })
}).strict()
  .superRefine((data, ctx) => {
    const hasPassword = !!data.newPassword
    const hasConfirm = !!data.confirmNewPassword
    if (hasPassword !== hasConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'both password and confirmPassword must be fulfilled',
        path: hasPassword ? ['confirmNewPassword'] : ['newPassword']
      })
    }

    if (hasPassword && hasConfirm && data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'newPassword and confirmNewPassword do not match',
        path: ['confirmNewPassword']
      })
    }
  })

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
