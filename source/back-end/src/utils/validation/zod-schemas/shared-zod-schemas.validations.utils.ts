import z from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class SharedSchemas {
  public static registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string()
      .regex(RegexPatterns.password, {
        message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and one special character (@$!%*?&).'
      }),
    confirmPassword: z.string()
      .regex(RegexPatterns.password, {
        message: 'Confirm password must follow the same rules as password.'
      })
  }).strict()
    .superRefine((data, ctx) => {
      const hasPassword = !!data.password
      const hasConfirm = !!data.confirmPassword
      if (hasPassword !== hasConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'both password and confirmPassword must be fulfilled',
          path: hasPassword ? ['confirmPassword'] : ['password']
        })
      }

      if (hasPassword && hasConfirm && data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'password and confirmPassword do not match',
          path: ['confirmPassword']
        })
      }
    })
}

export { SharedSchemas }
