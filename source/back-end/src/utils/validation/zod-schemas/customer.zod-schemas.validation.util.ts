import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class CustomerSchemas {
  public static customerCompleteRegisterBodySchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)),
    birthdate: z.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg)
      }
      return arg
    }, z.date().refine((date) => !isNaN(date.getTime()) && date < new Date())),
    phone: z.string().refine((value) => RegexPatterns.phone.test(value))
  }).strict()

  public static createSchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)),
    birthdate: z.date().refine((date) => !isNaN(date.getTime()) && date < new Date()),
    email: z.string().email(),
    phone: z.string().refine((value) => RegexPatterns.phone.test(value))
  }).strict()

  public static updateSchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)).optional(),
    birthdate: z.date().refine((date) => !isNaN(date.getTime()) && date < new Date()).optional(),
    email: z.string().email().optional(),
    phone: z.string().refine((value) => RegexPatterns.phone.test(value)).optional()
  }).strict()

  public static registerCustomerBodySchema = z.object({
    email: z.string().email(),
    password: z.string()
      .regex(RegexPatterns.password, {
        message: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and one special character (@$!%*?&).",
      }),
    confirmPassword: z.string()
      .regex(RegexPatterns.password, {
        message: "Confirm password must follow the same rules as password.",
      })
  }).strict()
    .superRefine((data, ctx) => {
      const hasPassword = !!data.password;
      const hasConfirm = !!data.confirmPassword;
      if (hasPassword !== hasConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'both password and confirmPassword must be fulfilled',
          path: hasPassword ? ['confirmPassword'] : ['password'],
        });
      }

      if (hasPassword && hasConfirm && data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'password and confirmPassword do not match',
          path: ['confirmPassword'],
        });
      }
    })
}

export { CustomerSchemas }
