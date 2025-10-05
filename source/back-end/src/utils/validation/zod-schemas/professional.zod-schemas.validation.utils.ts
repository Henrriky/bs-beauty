import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'
import { NotificationChannel } from '@prisma/client'
import { SharedSchemas } from './shared-zod-schemas.validations.utils'

class ProfessionalSchemas {
  public static readonly socialMediaSchema = z.array(z.object({
    name: z.string().min(1).max(50),
    url: z.string().url()
  }).strict())

  public static readonly paymentMethodSchema = z.array(z.object({
    name: z.string().min(1).max(50),
  }).strict())

  public static readonly professionalCompleteRegisterBodySchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)),
    socialMedia: ProfessionalSchemas.socialMediaSchema.optional(),
    paymentMethods: ProfessionalSchemas.paymentMethodSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value))
  }).strict()

  public static createSchema = z.object({
    email: z.string().email(),
    socialMedia: ProfessionalSchemas.socialMediaSchema.optional(),
    paymentMethods: ProfessionalSchemas.paymentMethodSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value)).optional(),
    userType: z.enum(['MANAGER', 'EMPLOYEE']).optional(),
    specialization: z.string().min(3).max(3).optional(),
    password: z.string()
      .regex(RegexPatterns.password, {
        message: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and one special character (@$!%*?&).",
      })
      .optional(),
    confirmPassword: z.string()
      .regex(RegexPatterns.password, {
        message: "Confirm password must follow the same rules as password.",
      })
      .optional(),
  }).strict().superRefine((data, ctx) => {
    const hasPassword = !!data.password;
    const hasConfirm = !!data.confirmPassword;
    if (hasPassword !== hasConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Both password and confirmPassword must be fulfilled',
        path: hasPassword ? ['confirmPassword'] : ['password'],
      });
    }

    if (hasPassword && hasConfirm && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password and confirmPassword do not match',
        path: ['confirmPassword'],
      });
    }
  })

  public static registerProfessionalBodySchema = SharedSchemas.registerBodySchema

  public static managerUpdateSchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)).optional(),
    email: z.string().email().optional(),
    socialMedia: ProfessionalSchemas.socialMediaSchema.optional(),
    paymentMethods: ProfessionalSchemas.paymentMethodSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value)).optional(),
    userType: z.enum(['MANAGER', 'PROFESSIONAL']).optional(),
    specialization: z.string().min(3).max(30).optional(),
    notificationPreference: z.nativeEnum(NotificationChannel).optional()
  }).strict()

  public static professionalUpdateSchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)).optional(),
    email: z.string().email().optional(),
    socialMedia: ProfessionalSchemas.socialMediaSchema.optional(),
    paymentMethods: ProfessionalSchemas.paymentMethodSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value)).optional(),
    specialization: z.string().min(3).max(30).optional(),
    notificationPreference: z.nativeEnum(NotificationChannel).optional()
  }).strict()
}

export { ProfessionalSchemas }
