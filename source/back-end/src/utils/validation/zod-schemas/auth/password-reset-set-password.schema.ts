import z from "zod"
import { RegexPatterns } from "../../regex.validation.util"

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

export { PasswordResetSetPasswordSchema }